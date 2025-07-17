#!/usr/bin/env sh
pkg_root="$NODE_PATH/cmake-linter-precommit"
ast-grep scan -c="$pkg_root/sgconfig.yml" "$@"

exit $?
