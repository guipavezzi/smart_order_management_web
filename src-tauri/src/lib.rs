use tauri::Manager;
use tauri_plugin_shell::ShellExt;
use std::sync::Mutex;

struct SidecarState(Mutex<Option<tauri_plugin_shell::process::CommandChild>>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      
      // Inicia a API .NET (Sidecar) em segundo plano com tratamento de erros
      match app.shell().sidecar("api") {
          Ok(sidecar_command) => {
              match sidecar_command.spawn() {
                  Ok((mut rx, child)) => {
                      std::fs::write("C:\\Users\\guipa\\tauri_api_debug.txt", "Sidecar iniciado com sucesso").unwrap_or(());
                      
                      // Drena a saída para evitar Broken Pipe (EPIPE) que derruba a API no Windows
                      tauri::async_runtime::spawn(async move {
                          while let Some(_event) = rx.recv().await {
                              // Consome silenciosamente
                          }
                      });
                      
                      app.manage(SidecarState(Mutex::new(Some(child))));
                  },
                  Err(e) => {
                      let err_msg = format!("Falha ao executar o sidecar (spawn): {}", e);
                      std::fs::write("C:\\Users\\guipa\\tauri_api_debug.txt", err_msg).unwrap_or(());
                  }
              }
          },
          Err(e) => {
              let err_msg = format!("Falha ao configurar o sidecar (não encontrou binaries/api): {}", e);
              std::fs::write("C:\\Users\\guipa\\tauri_api_debug.txt", err_msg).unwrap_or(());
          }
      }

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
