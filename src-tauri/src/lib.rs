use tauri::Manager;
use tauri_plugin_shell::ShellExt;
use std::sync::Mutex;

struct SidecarState(Mutex<Option<tauri_plugin_shell::process::CommandChild>>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  #[allow(unused_mut)]
  let mut app = tauri::Builder::default()
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
    .build(tauri::generate_context!())
    .expect("error while building tauri application");

  app.run(|app_handle, event| match event {
      tauri::RunEvent::Exit => {
          // Quando a aplicação fecha, garante que a API também seja encerrada
          let state = app_handle.state::<SidecarState>();
          let mut lock = state.0.lock().unwrap();
          if let Some(child) = lock.take() {
              let _ = child.kill();
              println!("Sidecar encerrado.");
          }
      }
      _ => {}
  });
}
