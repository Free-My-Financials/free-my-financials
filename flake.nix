{
  description = "Nix flake for Free My Financials";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    devenv.url = "github:cachix/devenv";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs = inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [ inputs.devenv.flakeModule ];
      systems = [ "x86_64-linux" "aarch64-linux" "aarch64-darwin" "x86_64-darwin" ];
      perSystem = { config, self', inputs', pkgs, system, ... }:
        let
          nodejs = pkgs.nodejs_20;
        in
        {
          devenv.shells.default = {
            languages.javascript = {
              enable = true;
              package = nodejs;
            };

            scripts.prisma-init.exec = ''
              npm run prisma-init
            '';

            processes.nuxt.exec = ''
              prisma-init
              npm run dev
            '';

            services.postgres = {
              enable = true;
              package = pkgs.postgresql;
              initialDatabases = [{ name = "postgres"; }];
              initialScript = "CREATE USER postgres SUPERUSER;";
              listen_addresses = "127.0.0.1";
            };

            env = {
              PRISMA_SCHEMA_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/schema-engine";
              PRISMA_QUERY_ENGINE_BINARY = "${pkgs.prisma-engines}/bin/query-engine";
              PRISMA_QUERY_ENGINE_LIBRARY = "${pkgs.prisma-engines}/lib/libquery_engine.node";
              PRISMA_FMT_BINARY = "${pkgs.prisma-engines}/bin/prisma-fmt";

              # Connection string for the local database
              DATABASE_URL = "postgresql://postgres@localhost:5432/postgres";
              JWT_SECRET = "DEV_SECRET";
            };

            packages = [
              pkgs.nodePackages.prisma
              pkgs.openssl
            ] ++ (if system == "x86_64-darwin" || system == "aarch64-darwin" then [ ] else [ pkgs.glibc ]);
          };
        };
    };
}
