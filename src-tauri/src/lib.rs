// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::fs::{OpenOptions, read_to_string};
use std::io::{Write, BufWriter};
use std::path::Path;
use std::error::Error;
use std::process::{Command, Stdio};

#[tauri::command]
fn write_to_hosts(content: &str) -> Result<(), String> {
    let path = "/etc/hosts";
    let formatted_entry = format!("\n{}", content); // Ensure newline before the entry

    let output = Command::new("osascript")
        .arg("-e")
        .arg(format!(
            "do shell script \"echo '{}' | sudo tee -a /etc/hosts\" with administrator privileges",
            formatted_entry
        ))
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .status()
        .map_err(|e| format!("Failed to execute osascript: {}", e))?;

    if output.success() {
        Ok(())
    } else {
        Err("Failed to write to /etc/hosts".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![write_to_hosts])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
