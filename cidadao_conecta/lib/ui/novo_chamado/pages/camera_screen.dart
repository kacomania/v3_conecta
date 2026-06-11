import 'package:flutter/material.dart';
import 'package:camerawesome/camerawesome_plugin.dart';
import 'package:go_router/go_router.dart';
import 'package:path_provider/path_provider.dart';
import 'package:uuid/uuid.dart';

class CameraScreen extends StatelessWidget {
  const CameraScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: CameraAwesomeBuilder.awesome(
        saveConfig: SaveConfig.photo(
          pathBuilder: (sensors) async {
            final directory = await getTemporaryDirectory();
            final uuid = const Uuid().v4();
            return SingleCaptureRequest(
              '${directory.path}/chamado_$uuid.jpg',
              sensors.first,
            );
          },
        ),
        enablePhysicalButton: true,
        onMediaTap: (mediaCapture) {
          mediaCapture.captureRequest.when(
            single: (single) {
              if (single.file?.path != null) {
                context.pop(single.file!.path);
              }
            },
            multiple: (multiple) {},
          );
        },
      ),
    );
  }
}
