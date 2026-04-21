## Embedded: build all embedded resources
.PHONY: embedded
embedded: ./src-tauri/embedded/bin/pipessh-*

## Build embedded pipessh
./src-tauri/embedded/bin/pipessh-*: ./src-tauri/embedded/workspace/pipessh/
	cd ./src-tauri/embedded/workspace/pipessh/ && go build .
	node ./utils/sidecar-rename.mjs pipessh

.PHONY: release
release: embedded
	pnpm tauri build
