#!/usr/bin/env sh
pkg_root="$NODE_PATH/cmake-linter-precommit"
ast-grep scan --report-style short --color never -c="$pkg_root/sgconfig.yml" "$@"

exit $?
