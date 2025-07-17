#!/usr/bin/env bash
pkg_root="$NODE_PATH/cmake-linter-precommit"
ast-grep scan -c="$pkg_root/sgconfig.yml" "$@"
ret=$?

exit $ret
