---
date: 2024-08-29
title: Rust常用库合集
category: Programming
tags:
- Rust
- crates.io
description: 收集日常使用的 rust crates
---

# Rust常用库合集

## 分类

- [网络](#网络)
- [CLI](#cli)
- [Result](#result)


## 网络

- [`tokio`](#tokio)
- [`poem`](#poem)
- [`reqwest`](#reqwest)


### `tokio`

- link: [`https://crates.io/crates/tokio`](https://crates.io/crates/tokio)
- docs: [`https://docs.rs/tokio/latest/tokio/`](https://docs.rs/tokio/latest/tokio/)
- description: 最主流的`rust`异步运行时
- features(commonly used)
  - [`full`](https://docs.rs/crate/tokio/latest/features#full): 使用所有`feature`(安装不必要依赖较多，不推荐)
  - [`macros`](https://docs.rs/crate/tokio/latest/features#macros): 启用`tokio`的宏，如`tokio::main`等
  - [`rt-multi-thread`](https://docs.rs/crate/tokio/latest/features#rt-multi-thread): 启用多线程支持，获取更好的并发能力
  - [`tracing`](https://docs.rs/crate/tokio/latest/features#tracing): 启用后可在已经注册的`tracing`日志打印工具下打印`tokio`的运行日志
- Cargo.toml
  ```toml
  [dependencies]
  tokio = { version = "1.39.3", features = ["macros", "rt-multi-thread"] }
  ```
- example
  ```rust
  async fn print_hello() {
    println!("Hello tokio!");
  }

  #[tokio::main]
  async fn main() {
    print_hello().await;
  }
  ```


### `poem`

- link: [`https://crates.io/crates/poem`](https://crates.io/crates/poem)
- docs: [`https://docs.rs/poem/latest/poem/`](https://docs.rs/poem/latest/poem/)
- description: `WEB Server`库
- features(commonly used)
  - [`embed`](https://docs.rs/crate/poem/latest/features#embed): 内嵌某个文件夹里的文件到某个路由下
  - [`static-files`](https://docs.rs/crate/poem/latest/features#static-files): 将某个文件夹映射到某个路由下
  - [`multipart`](https://docs.rs/crate/poem/latest/features#multipart): 支持多文件上传
- Cargo.toml
  - 默认
    ```toml
    [dependencies]
    tokio = { version = "1.39.3", features = ["macros", "rt-multi-thread"] }
    poem = { version = "3.0.4" }
    ```
  - 支持上传文件
    ```toml
    [dependencies]
    tokio = { version = "1.39.3", features = ["macros", "rt-multi-thread"] }
    poem = { version = "3.0.4", features = ["multipart"] }
    ```
  - 支持内嵌文件到路由
    ```toml
    [dependencies]
    tokio = { version = "1.39.3", features = ["macros", "rt-multi-thread"] }
    poem = { version = "3.0.4", features = ["embed"] }
    ```
  - 支持映射文件夹到路由
    ```toml
    tokio = { version = "1.39.3", features = ["macros", "rt-multi-thread"] }
    poem = { version = "3.0.4", features = ["static-files"] }
    ```
- example
  - 默认
    ```rust
    use poem::{get, handler, listener::TcpListener, web::Path, Route, Server, middleware::Tracing};

    #[handler]
    fn hello(Path(name): Path<String>) -> String {
      format!("hello: {}", name)
    }

    #[tokio::main]
    async fn main() -> Result<(), std::io::Error> {
      if std::env::var_os("RUST_LOG").is_none() {
        std::env::set_var("RUST_LOG", "poem=debug");
      }
      tracing_subscriber::fmt::init();

      let app = Route::new()
                  .at("/hello/:name", get(hello))
                  .with(Tracing);

      Server::new(TcpListener::bind("0.0.0.0:3000"))
        .run(app)
        .await
    }
    ```
  - 支持上传文件
    ```rust
    use poem::{
      error::{BadRequest, Error},
      web::Multipart,
      Result,
    };

    async fn upload(mut multipart: Multipart) -> Result<()> {
      while let Some(field) = multipart.next_field().await? {
        let data = field.bytes().await.map_err(BadRequest)?;
        println!("{} bytes", data.len());
      }
      Ok(())
    }
    ```
  - 支持内嵌文件到路由
    ```rust
    use poem::{
      endpoint::{EmbeddedFileEndpoint, EmbeddedFilesEndpoint},
      listener::TcpListener,
      Route, Server,
    };
    use rust_embed::RustEmbed;

    #[derive(RustEmbed)]
    #[folder = "files"]
    pub struct Files;

    #[tokio::main]
    async fn main() -> Result<(), std::io::Error> {
      if std::env::var_os("RUST_LOG").is_none() {
        std::env::set_var("RUST_LOG", "poem=debug");
      }
      tracing_subscriber::fmt::init();

      let app = Route::new()
        .at("/", EmbeddedFileEndpoint::<Files>::new("index.html"))
        .nest("/files", EmbeddedFilesEndpoint::<Files>::new());

      Server::new(TcpListener::bind("0.0.0.0:3000"))
        .run(app)
        .await
    }
    ```
  - 支持映射文件夹到路由
  ```rust
  use poem::{endpoint::StaticFilesEndpoint, listener::TcpListener, Route, Server};

  #[tokio::main]
  async fn main() -> Result<(), std::io::Error> {
    if std::env::var_os("RUST_LOG").is_none() {
      std::env::set_var("RUST_LOG", "poem=debug");
    }
    tracing_subscriber::fmt::init();

    let app = Route::new().nest(
      "/",
      StaticFilesEndpoint::new("./poem/static-files/files").show_files_listing(),
    );
    Server::new(TcpListener::bind("0.0.0.0:3000"))
      .run(app)
      .await
  }
  ```

### `reqwest`

- link: [`https://crates.io/crates/reqwest`](https://crates.io/crates/reqwest)
- docs: [`https://docs.rs/reqwest/latest/reqwest/`](https://docs.rs/reqwest/latest/reqwest/)
- description: `WEB Client`库
- features(commonly used):
  - [`blocking`](https://docs.rs/crate/reqwest/latest/features#blocking): 阻塞式请求，使其不需要异步运行时
  - [`cookies`](https://docs.rs/crate/reqwest/latest/features#cookies): 请求时加入请求历史中存储的cookie
  - [`json`](https://docs.rs/crate/reqwest/latest/features#cookies): 请求时将JSON序列化后传入body/将获取到的结果进行JSON反序列化
  - [`stream`](https://docs.rs/crate/reqwest/latest/features#cookies): 支持流式传输
- Cargo.toml
  ```toml
  [dependencies]
  tokio = { version = "1.39.3", features = ["macros", "rt-multi-thread"] }
  reqwest = { version = "0.12.7", features = ["json"] }
  ```
- example
  ```rust
  use std::collections::HashMap;

  #[tokio::main]
  async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let resp = reqwest::get("https://httpbin.org/ip")
      .await?
      .json::<HashMap<String, String>>()
      .await?;
    println!("{resp:#?}");
    Ok(())
  }
  ```

## CLI

- [`clap`](#clap)


### `clap`

- link: [`https://crates.io/crates/clap`](https://crates.io/crates/clap)
- docs: [`https://docs.rs/clap/latest/clap/`](https://docs.rs/clap/latest/clap/)
- description: `Command Line Interface`库
- features(commony used):
  - `derive`: 启用`derive trait`(派生宏)支持
- Cargo.toml
  ```toml
  [dependencies]
  clap = { version = "4.5.16", features = ["derive"] }
  ```
- example
  - 默认
    ```rust
    use clap::Parser;

    /// Simple program to greet a person
    #[derive(Parser, Debug)]
    #[command(version, about, long_about = None)]
    struct Args {
      /// Name of the person to greet
      #[arg(short, long)]
      name: String,

      /// Number of times to greet
      #[arg(short, long, default_value_t = 1)]
      count: u8,
    }

    fn main() {
      let args = Args::parse();

      for _ in 0..args.count {
        println!("Hello {}!", args.name);
      }
    }
    ```

    `HELP`信息

    ```text
    $ demo --help
    A simple to use, efficient, and full-featured Command Line Argument Parser

    Usage: demo[EXE] [OPTIONS] --name <NAME>

    Options:
      -n, --name <NAME>    Name of the person to greet
      -c, --count <COUNT>  Number of times to greet [default: 1]
      -h, --help           Print help
      -V, --version        Print version

    $ demo --name Me
    Hello Me!
    ```
  - 相斥参数
    ```rust
    use clap::{Args, Parser};

    #[derive(Parser)]
    #[command(version, about, long_about = None)]
    struct Cli {
      #[command(flatten)]
      vers: Vers,

      /// some regular input
      #[arg(group = "input")]
      input_file: Option<String>,

      /// some special input argument
      #[arg(long, group = "input")]
      spec_in: Option<String>,

      #[arg(short, requires = "input")]
      config: Option<String>,
    }

    #[derive(Args)]
    #[group(required = true, multiple = false)]
    struct Vers {
      /// set version manually
      #[arg(long, value_name = "VER")]
      set_ver: Option<String>,

      /// auto inc major
      #[arg(long)]
      major: bool,

      /// auto inc minor
      #[arg(long)]
      minor: bool,

      /// auto inc patch
      #[arg(long)]
      patch: bool,
    }

    fn main() {
      let cli = Cli::parse();

      // Let's assume the old version 1.2.3
      let mut major = 1;
      let mut minor = 2;
      let mut patch = 3;

      // See if --set_ver was used to set the version manually
      let vers = &cli.vers;
      let version = if let Some(ver) = vers.set_ver.as_deref() {
        ver.to_string()
      } else {
        // Increment the one requested (in a real program, we'd reset the lower numbers)
        let (maj, min, pat) = (vers.major, vers.minor, vers.patch);
        match (maj, min, pat) {
            (true, _, _) => major += 1,
            (_, true, _) => minor += 1,
            (_, _, true) => patch += 1,
            _ => unreachable!(),
        };
        format!("{major}.{minor}.{patch}")
      };

      println!("Version: {version}");

      // Check for usage of -c
      if let Some(config) = cli.config.as_deref() {
        let input = cli
          .input_file
          .as_deref()
          .unwrap_or_else(|| cli.spec_in.as_deref().unwrap());
        println!("Doing work using input {input} and config {config}");
      }
    }
    ```

    `HELP`信息:
    
    ```text
    $ 04_03_relations_derive --help
    A simple to use, efficient, and full-featured Command Line Argument Parser

    Usage: 04_03_relations_derive[EXE] [OPTIONS] <--set-ver <VER>|--major|--minor|--patch> [INPUT_FILE]

    Arguments:
      [INPUT_FILE]  some regular input

    Options:
          --set-ver <VER>      set version manually
          --major              auto inc major
          --minor              auto inc minor
          --patch              auto inc patch
          --spec-in <SPEC_IN>  some special input argument
      -c <CONFIG>              
      -h, --help               Print help
      -V, --version            Print version

    $ 04_03_relations_derive
    ? failed
    error: the following required arguments were not provided:
      <--set-ver <VER>|--major|--minor|--patch>

    Usage: 04_03_relations_derive[EXE] <--set-ver <VER>|--major|--minor|--patch> [INPUT_FILE]

    For more information, try '--help'.

    $ 04_03_relations_derive --major
    Version: 2.2.3

    $ 04_03_relations_derive --major --minor
    ? failed
    error: the argument '--major' cannot be used with '--minor'

    Usage: 04_03_relations_derive[EXE] <--set-ver <VER>|--major|--minor|--patch> [INPUT_FILE]

    For more information, try '--help'.

    $ 04_03_relations_derive --major -c config.toml
    ? failed
    error: the following required arguments were not provided:
      <INPUT_FILE|--spec-in <SPEC_IN>>

    Usage: 04_03_relations_derive[EXE] -c <CONFIG> <--set-ver <VER>|--major|--minor|--patch> <INPUT_FILE|--spec-in <SPEC_IN>>

    For more information, try '--help'.

    $ 04_03_relations_derive --major -c config.toml --spec-in input.txt
    Version: 2.2.3
    Doing work using input input.txt and config config.toml
    ```

## Result

- [Result处理](#result处理)
- [错误处理](#错误处理)


### Result处理

- [`anyhow`](#anyhow)


### `anyhow`

- link: [`https://crates.io/crates/anyhow`](https://crates.io/crates/anyhow)
- docs: [`https://docs.rs/anyhow/latest/anyhow`](https://docs.rs/anyhow/latest/anyhow)
- description: 处理常见的错误类型并打印
- features(commony used)
  - [`backtrace`](https://docs.rs/crate/anyhow/latest/features#backtrace)
- Cargo.toml
  ```toml
  [dependencies]
  anyhow = { version = "1.0.86" }
  # anyhow = { version = "1.0.86", features = ["backtrace"] } # 支持打印栈回溯信息
  ```
- example
  ```rust
  use anyhow::{anyhow, Result};
  use std::fs::File;

  fn main() -> Result<()> {
    // let _file = File::open("错误的路径").map_err(|_| anyhow!("无法打开文件"))?; // 快速自定义错误信息
    let _file = File::open("错误的路径")?;

    Ok(())
  }

  ```


### 错误处理

- [`thiserror`](#thiserror)


#### `thiserror`

- link: [`https://crates.io/crates/thiserror`](https://crates.io/crates/thiserror)
- docs: [`https://docs.rs/thiserror/latest/thiserror/`](https://docs.rs/thiserror/latest/thiserror/)
- Cargo.toml
  ```toml
  [dependencies]
  thiserror = { version = "1.0.63" }
  ```
- example
  - 自定义错误
    ```rust
    use thiserror::Error;

    #[derive(Error, Debug)]
    pub enum MyError {
      #[error("data store disconnected")]
      Disconnect(#[from] io::Error),
      #[error("the data for key `{0}` is not available")]
      Redaction(String),
      #[error("invalid header (expected {expected:?}, found {found:?})")]
      InvalidHeader {
          expected: String,
          found: String,
      },
      #[error("unknown data store error")]
      Unknown,
    }
    ```
  - 继承错误 + 错误信息
    ```rust
    #[derive(Error, Debug)]
    pub enum MyError {
      ...

      #[error(transparent)]
      Other(#[from] anyhow::Error),  // source and Display delegate to anyhow::Error
    }
    ```

<Comment />