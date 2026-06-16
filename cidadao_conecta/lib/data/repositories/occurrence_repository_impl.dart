import 'dart:developer';
import 'dart:io';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../domain/entities/draft_solicitacao.dart';
import '../../domain/entities/occurrence_entity.dart';
import '../../domain/entities/occurrence_timeline_entity.dart';
import '../../domain/repositories/occurrence_repository.dart';

/// Implementação concreta do repositório de ocorrências (chamados) utilizando Supabase.
///
/// Responsável por gerenciar todo o ciclo de vida de um chamado pelo lado do cidadão,
/// encapsulando as chamadas diretas ao banco de dados e as invocações de Edge Functions
/// (como embeddings e análise de sentimento), mantendo a Clean Architecture.
class OccurrenceRepositoryImpl implements OccurrenceRepository {
  final SupabaseClient _supabase;

  OccurrenceRepositoryImpl(this._supabase);

  /// Registra um novo chamado e delega o processamento de IA (embeddings) para o backend.
  ///
  /// O processo envolve primeiro o upload sequencial de fotos para o Storage, seguido pela
  /// persistência do registro principal na tabela `occurrences`. Após a criação, invoca de forma 
  /// assíncrona (fire-and-forget) a Edge Function `generate-embedding` para habilitar futuras buscas
  /// semânticas e detecção de duplicidade sem bloquear a resposta ao usuário.
  @override
  Future<String> createOccurrence(DraftSolicitacao draft, String userId, String prefeituraId) async {
    List<String> imageUrls = [];

    // Upload das fotos
    if (draft.fotos.isNotEmpty) {
      for (var i = 0; i < draft.fotos.length; i++) {
        final photoPath = draft.fotos[i];
        final file = File(photoPath);
        
        if (await file.exists()) {
          final fileName = '${DateTime.now().millisecondsSinceEpoch}_${userId}_$i.jpg';
          final filePath = '$userId/$fileName';
          
          await _supabase.storage.from('occurrences_media').upload(
            filePath,
            file,
            fileOptions: const FileOptions(cacheControl: '3600', upsert: false),
          );
          
          final url = _supabase.storage.from('occurrences_media').getPublicUrl(filePath);
          imageUrls.add(url);
        }
      }
    }

    // Fazer o Insert
    // Apenas envia category_id se for um UUID válido (contém '-')
    final validCategoryId = (draft.idCategoria != null && draft.idCategoria!.contains('-')) 
        ? draft.idCategoria 
        : null;

    final response = await _supabase.from('occurrences').insert({
      'title': draft.titulo.isNotEmpty ? draft.titulo : 'Sem título',
      'description': draft.descricao,
      'latitude': draft.latitude,
      'longitude': draft.longitude,
      'image_url': imageUrls.isNotEmpty ? imageUrls.first : null,
      'image_urls': imageUrls,
      'status': 'PENDING',
      'user_id': userId,
      'category_id': validCategoryId,
      'prefeitura_id': prefeituraId,
    }).select('id').single();

    final occurrenceId = response['id'] as String;

    try {
      await _supabase.functions.invoke(
        'generate-embedding',
        body: {'occurrence_id': occurrenceId, 'description': draft.descricao},
      );
    } catch (e) {
      log('Failed to invoke generate-embedding: $e');
    }

    return occurrenceId;
  }

  @override
  Future<List<Map<String, dynamic>>> findDuplicates(String description, double lat, double lng, String prefeituraId) async {
    final res = await _supabase.functions.invoke(
      'find-duplicates',
      body: {
        'description': description,
        'latitude': lat,
        'longitude': lng,
        'prefeitura_id': prefeituraId,
      },
    );
    
    if (res.status == 200) {
      final matches = res.data['matches'] as List<dynamic>?;
      return matches?.cast<Map<String, dynamic>>() ?? [];
    }
    return [];
  }

  /// Adiciona o apoio de um cidadão a um chamado existente.
  ///
  /// Esta operação atua de forma atômica para evitar duplicações (tratando o erro `23505` do PostgreSQL).
  /// Também é responsável por atualizar o contador de apoios de forma manual e gerar um registro
  /// público na linha do tempo (`occurrence_timeline`), garantindo a rastreabilidade do engajamento social.
  @override
  Future<void> supportOccurrence(String occurrenceId) async {
    final userId = _supabase.auth.currentUser?.id;
    if (userId == null) throw Exception("Usuário não logado");

    // Inserir apoio
    try {
      await _supabase.from('occurrence_supporters').insert({
        'user_id': userId,
        'occurrence_id': occurrenceId,
      });
    } on PostgrestException catch (e) {
      if (e.code == '23505') {
        throw Exception("Você já apoiou este chamado anteriormente!");
      }
      rethrow;
    }
    
    // Incrementar contador manualmente
    final current = await _supabase
        .from('occurrences')
        .select('supporters_count')
        .eq('id', occurrenceId)
        .single();
    
    final currentCount = current['supporters_count'] as int? ?? 0;
    
    await _supabase.from('occurrences').update({
      'supporters_count': currentCount + 1,
    }).eq('id', occurrenceId);

    // Inserir log na linha do tempo
    await _supabase.from('occurrence_timeline').insert({
      'occurrence_id': occurrenceId,
      'created_by': userId,
      'new_status': current['status'] ?? 'PENDING',
      'description': 'O chamado recebeu um novo apoio de um cidadão.',
      'is_public': true,
    });
  }

  @override
  Future<List<OccurrenceEntity>> getOccurrencesByUser(String userId) async {
    // Busca os chamados criados pelo usuário
    final createdResponse = await _supabase
        .from('occurrences')
        .select()
        .eq('user_id', userId);

    // Busca os chamados apoiados pelo usuário
    final supportedResponse = await _supabase
        .from('occurrence_supporters')
        .select('occurrences(*)')
        .eq('user_id', userId);

    final List<dynamic> allJson = [];
    allJson.addAll(createdResponse as List);

    final supportedList = supportedResponse as List;
    for (var item in supportedList) {
      if (item['occurrences'] != null) {
        allJson.add(item['occurrences']);
      }
    }

    // Remover duplicatas e ordenar
    final uniqueMap = <String, dynamic>{};
    for (var json in allJson) {
      uniqueMap[json['id']] = json;
    }

    final uniqueList = uniqueMap.values.toList();
    uniqueList.sort((a, b) {
      final dateA = DateTime.parse(a['created_at']);
      final dateB = DateTime.parse(b['created_at']);
      return dateB.compareTo(dateA); // decrescente
    });

    return uniqueList.map((json) => OccurrenceEntity(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      latitude: json['latitude']?.toDouble(),
      longitude: json['longitude']?.toDouble(),
      imageUrl: json['image_url'],
      imageUrls: List<String>.from(json['image_urls'] ?? []),
      status: json['status'],
      userId: json['user_id'],
      categoryId: json['category_id'],
      departmentId: json['department_id'],
      prefeituraId: json['prefeitura_id'],
      createdAt: DateTime.parse(json['created_at']),
      supportersCount: json['supporters_count'] as int? ?? 0,
      originalLatitude: json['original_latitude']?.toDouble(),
      originalLongitude: json['original_longitude']?.toDouble(),
      locationEditedAt: json['location_edited_at'] != null
          ? DateTime.parse(json['location_edited_at'])
          : null,
      dueDate: json['due_date'] != null
          ? DateTime.parse(json['due_date'])
          : null,
      rating: json['rating'],
      feedbackNotes: json['feedback_notes'],
    )).toList();
  }

  @override
  Future<List<OccurrenceTimelineEntity>> getTimelineForOccurrence(String occurrenceId) async {
    final response = await _supabase
        .from('occurrence_timeline')
        .select()
        .eq('occurrence_id', occurrenceId)
        .eq('is_public', true)
        .order('created_at', ascending: true);

    return (response as List).map((json) => OccurrenceTimelineEntity(
      id: json['id'],
      occurrenceId: json['occurrence_id'],
      createdBy: json['created_by'],
      oldStatus: json['old_status'],
      newStatus: json['new_status'],
      description: json['description'],
      imageUrl: json['image_url'],
      isPublic: json['is_public'],
      createdAt: DateTime.parse(json['created_at']),
    )).toList();
  }

  /// Fornece um fluxo (stream) em tempo real da linha do tempo pública de uma ocorrência.
  ///
  /// **Workaround do Realtime:** A filtragem por itens públicos (`is_public == true`) é 
  /// propositalmente realizada em memória (no lado do cliente via `.where()`) e não diretamente 
  /// na query do Supabase. Isso ocorre devido a uma limitação conhecida do `wal2json` no backend 
  /// do Supabase, que pode não lidar corretamente com filtros booleanos acoplados a listeners 
  /// do Realtime em algumas versões da API.
  @override
  Stream<List<OccurrenceTimelineEntity>> getTimelineStreamForOccurrence(String occurrenceId) {
    return _supabase
        .from('occurrence_timeline')
        .stream(primaryKey: ['id'])
        .eq('occurrence_id', occurrenceId)
        .order('created_at', ascending: true)
        .map((list) => list
            .where((json) => json['is_public'] == true)
            .map((json) => OccurrenceTimelineEntity(
              id: json['id'],
              occurrenceId: json['occurrence_id'],
              createdBy: json['created_by'],
              oldStatus: json['old_status'],
              newStatus: json['new_status'],
              description: json['description'],
              imageUrl: json['image_url'],
              isPublic: json['is_public'],
              createdAt: DateTime.parse(json['created_at']),
            )).toList());
  }

  @override
  Future<void> updateOccurrenceLocation(
    String occurrenceId,
    double newLat,
    double newLng,
  ) async {
    final current = await _supabase
        .from('occurrences')
        .select('latitude, longitude, location_edited_at')
        .eq('id', occurrenceId)
        .single();

    if (current['location_edited_at'] != null) {
      throw Exception('A localização desta ocorrência já foi editada e não pode ser alterada novamente.');
    }

    await _supabase.from('occurrences').update({
      'original_latitude': current['latitude'],
      'original_longitude': current['longitude'],
      'latitude': newLat,
      'longitude': newLng,
      'location_edited_at': DateTime.now().toUtc().toIso8601String(),
    }).eq('id', occurrenceId);
  }

  /// Avalia a qualidade do atendimento de um chamado já concluído.
  ///
  /// Garante regras de negócio estritas (a nota deve ser de 1 a 5, e a ocorrência deve estar concluída 
  /// e não avaliada previamente). Assim como na criação, aciona de forma assíncrona a Edge Function 
  /// `analyze-sentiment` para processar o feedback textualmente sem atrasar a resposta da UI do cidadão.
  @override
  Future<void> rateOccurrence(String occurrenceId, int rating, String? feedbackNotes) async {
    // Busca status e nota atual
    final current = await _supabase
        .from('occurrences')
        .select('status, rating')
        .eq('id', occurrenceId)
        .single();

    if (current['status'] != 'COMPLETED') {
      throw Exception('Apenas chamados concluídos podem ser avaliados.');
    }
    if (current['rating'] != null) {
      throw Exception('Este chamado já foi avaliado.');
    }
    if (rating < 1 || rating > 5) {
      throw Exception('A nota deve ser entre 1 e 5.');
    }

    await _supabase.from('occurrences').update({
      'rating': rating,
      'feedback_notes': feedbackNotes,
    }).eq('id', occurrenceId);

    // Call analyze-sentiment asynchronously without breaking the citizen flow
    try {
      await _supabase.functions.invoke(
        'analyze-sentiment',
        body: {'occurrence_id': occurrenceId, 'feedback': feedbackNotes},
      );
    } catch (e) {
      log('Failed to invoke analyze-sentiment: $e');
    }
  }

}
