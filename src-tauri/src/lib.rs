use tauri_plugin_shell::ShellExt;

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
      
      // Inicia a API .NET (Sidecar) em segundo plano
      let sidecar_command = app.shell().sidecar("api").expect("Erro ao inicializar sidecar");
      let (_rx, _child) = sidecar_command.spawn().expect("Falha ao rodar a API");

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
