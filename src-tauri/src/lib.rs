/* Required by Payload
use tauri::Manager;
*/

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/* Required by tauri_plugin_single_instance
#[derive(Clone, serde::Serialize)]
struct Payload {
    args: Vec<String>,
    cwd: String,
}
*/

static MAIN_WINDOW_LABEL: &str = "main";

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        /* Disabled due to lack of stability
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            // Find main window of existing instance
            let main_window_option = app.get_webview_window(MAIN_WINDOW_LABEL);

            if let Some(main_window) = main_window_option {
                // Focus on existing main window
                main_window.unminimize().expect("Can't un-minimize Window");
                main_window.set_focus().expect("Can't focus Window");
            } else {
                // Start main window and focus
                // For initialize values please refer to src-tauri/tauri.conf.json
                let main_window = tauri::WebviewWindowBuilder::new(
                    app,
                    MAIN_WINDOW_LABEL, /* the unique window label */
                    tauri::WebviewUrl::App("index.html".into())
                )
                    .title("Nekops") // Initial title
                    .inner_size(1200.0, 800.0) // Initial size
                    .build()
                    .unwrap();
                main_window.set_focus().unwrap();
            }

            // Print message
            println!("{}, {argv:?}, {cwd}", app.package_info().name);
            app.emit("single-instance", Payload { args: argv, cwd }).unwrap();
        }))
        */
        // .plugin(tauri_plugin_window::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![greet])
        // .on_window_event(|window, event| match event {
        //     tauri::WindowEvent::CloseRequested { api, .. } => {
        //         // Window state control: only destroy main window when there's no other windows
        //         if window.label() == MAIN_WINDOW_LABEL && // Is main window
        //             window.app_handle().webview_windows().len() > 1 { // Is not the only window
        //
        //             window.minimize().unwrap(); // Minimize main window
        //             api.prevent_close(); // And prevent close
        //         }
        //     }
        //     _ => {}
        // })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
