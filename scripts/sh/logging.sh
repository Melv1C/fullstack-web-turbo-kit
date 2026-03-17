#!/usr/bin/env sh

# Shared logging helpers for local shell scripts.
if [ -t 1 ] && [ -z "${NO_COLOR:-}" ]; then
  C_RESET='\033[0m'
  C_BOLD='\033[1m'
  C_BLUE='\033[34m'
  C_GREEN='\033[32m'
  C_RED='\033[31m'
  C_CYAN='\033[36m'
else
  C_RESET=''
  C_BOLD=''
  C_BLUE=''
  C_GREEN=''
  C_RED=''
  C_CYAN=''
fi

info() {
  printf "%b[INFO]%b %s\n" "$C_BLUE" "$C_RESET" "$1"
}

ok() {
  printf "%b[OK]%b %s\n" "$C_GREEN" "$C_RESET" "$1"
}

error() {
  printf "%b[ERROR]%b %s\n" "$C_RED" "$C_RESET" "$1"
}

section() {
  printf "\n%b== %s ==%b\n" "$C_BOLD$C_CYAN" "$1" "$C_RESET"
}

output_start() {
  printf "%b%s%b\n" "$C_BOLD$C_CYAN" "[output] start" "$C_RESET"
}

output_end() {
  printf "%b%s%b\n" "$C_BOLD$C_CYAN" "[output] end" "$C_RESET"
}

run_step() {
  label="$1"
  shift

  section "$label"
  info "Command: $*"
  output_start

  if "$@"; then
    output_end
    ok "$label"
  else
    exit_code=$?
    output_end
    error "$label failed (exit code: $exit_code)"
    return "$exit_code"
  fi
}