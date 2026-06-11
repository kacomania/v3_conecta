'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// Tipagens
export type Prefeitura = {
  id: string;
  name: string;
  primary_color: string | null;
  secondary_color: string | null;
  logo_url: string | null;
  created_at: string;
};

export type Department = {
  id: string;
  name: string;
  prefeitura_id: string;
  created_at: string;
};

// Actions para Prefeituras
export async function getPrefeituras(): Promise<Prefeitura[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('prefeituras')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching prefeituras:', error);
    return [];
  }
  return data;
}

export async function createPrefeitura(formData: FormData) {
  const name = formData.get('name') as string;
  const primary_color = formData.get('primary_color') as string || null;
  const secondary_color = formData.get('secondary_color') as string || null;
  const logoFile = formData.get('logo') as File | null;

  if (!name) return { error: 'O nome é obrigatório' };

  const supabase = await createClient();
  
  const { data: newPref, error: insertError } = await supabase
    .from('prefeituras')
    .insert([{ name, primary_color, secondary_color }])
    .select('id')
    .single();

  if (insertError || !newPref) {
    console.error('Error creating prefeitura:', insertError);
    return { error: 'Erro ao criar prefeitura' };
  }

  if (logoFile && logoFile.size > 0) {
    const fileExt = logoFile.name.split('.').pop();
    const fileName = `${newPref.id}-${Date.now()}.${fileExt}`;
    
    const arrayBuffer = await logoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('tenant_assets')
      .upload(fileName, buffer, { upsert: true, contentType: logoFile.type });
      
    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from('tenant_assets')
        .getPublicUrl(fileName);
        
      await supabase
        .from('prefeituras')
        .update({ logo_url: publicUrlData.publicUrl })
        .eq('id', newPref.id);
    } else {
      console.error('Error uploading logo:', uploadError);
      return { error: `Erro ao criar prefeitura (upload): ${uploadError.message}` };
    }
  }

  revalidatePath('/dashboard/configuracoes');
  return { success: true };
}

// Actions para Secretarias (Departamentos)
export async function getDepartmentsByPrefeitura(prefeituraId: string): Promise<Department[]> {
  if (!prefeituraId) return [];
  
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .eq('prefeitura_id', prefeituraId)
    .order('name');

  if (error) {
    console.error('Error fetching departments:', error);
    return [];
  }
  return data;
}

export async function createDepartment(formData: FormData) {
  const name = formData.get('name') as string;
  const prefeitura_id = formData.get('prefeitura_id') as string;

  if (!name || !prefeitura_id) {
    return { error: 'O nome e a prefeitura são obrigatórios' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('departments')
    .insert([{ name, prefeitura_id }]);

  if (error) {
    console.error('Error creating department:', error);
    return { error: 'Erro ao criar secretaria' };
  }

  revalidatePath('/dashboard/configuracoes');
  return { success: true };
}

export async function updateTenantIdentity(formData: FormData) {
  const prefeitura_id = formData.get('prefeitura_id') as string;
  const primary_color = formData.get('primary_color') as string || null;
  const secondary_color = formData.get('secondary_color') as string || null;
  const logoFile = formData.get('logo') as File | null;
  
  if (!prefeitura_id) return { error: 'Prefeitura ID é obrigatório' };
  
  const supabase = await createClient();
  let logo_url: string | undefined;

  if (logoFile && logoFile.size > 0) {
    const fileExt = logoFile.name.split('.').pop();
    const fileName = `${prefeitura_id}-${Date.now()}.${fileExt}`;
    
    const arrayBuffer = await logoFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('tenant_assets')
      .upload(fileName, buffer, { upsert: true, contentType: logoFile.type });
      
    if (uploadError) {
      console.error('Error uploading logo:', uploadError);
      return { error: `Erro ao fazer upload do logo: ${uploadError.message}` };
    }
    
    const { data: publicUrlData } = supabase.storage
      .from('tenant_assets')
      .getPublicUrl(fileName);
      
    logo_url = publicUrlData.publicUrl;
  }
  
  const updateData: any = { primary_color, secondary_color };
  if (logo_url !== undefined) {
    updateData.logo_url = logo_url;
  }
  
  const { error } = await supabase
    .from('prefeituras')
    .update(updateData)
    .eq('id', prefeitura_id);
    
  if (error) {
    console.error('Error updating prefeitura identity:', error);
    return { error: 'Erro ao atualizar identidade visual' };
  }
  
  revalidatePath('/dashboard/configuracoes');
  return { success: true };
}
