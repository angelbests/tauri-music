// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use download_rs::async_download::Download;
use tauri::{Manager, Window};
use std::{thread, time};
fn main() {
    
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![downloadmusic,startnode])
        .setup(|app| {
          startnoders(app.get_window("node").unwrap());
          thread::sleep(time::Duration::from_millis(500));
          Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


use tauri::api::process::{Command, CommandEvent};
#[tauri::command]
fn startnode(window:Window){
  let (mut rx, mut child) = Command::new_sidecar("music")
  .expect("failed to create `my-sidecar` binary command")
  .spawn()
  .expect("Failed to spawn sidecar");

  tauri::async_runtime::spawn(async move {
    // read events such as stdout
    while let Some(event) = rx.recv().await {
      if let CommandEvent::Stdout(line) = event {
        window
          .emit("message", Some(format!("'{}'", line)))
          .expect("failed to emit event");
        // write to stdin
        child.write("message from Rust\n".as_bytes()).unwrap();
      }
    }
  });
}


#[tauri::command]
fn downloadmusic(id:i32,url:String,dir:String,window:Window){
  tauri::async_runtime::spawn(async move {
    let download = Download::new(&url,Some(&dir),None);
    match  download.download() {
        Ok(_) => {
          window.emit("download", id).unwrap();
        },
        Err(_e)=> {
          window.emit("download", 0).unwrap();
        }
    }
  });
}



fn startnoders(window:Window){
  let (mut rx, mut child) = Command::new_sidecar("music")
  .expect("failed to create `my-sidecar` binary command")
  .spawn()
  .expect("Failed to spawn sidecar");

  tauri::async_runtime::spawn(async move {
    // read events such as stdout
    while let Some(event) = rx.recv().await {
      if let CommandEvent::Stdout(line) = event {
        window
          .emit("message", Some(format!("'{}'", line)))
          .expect("failed to emit event");
        // write to stdin
        child.write("message from Rust\n".as_bytes()).unwrap();
      }
    }
  });
}