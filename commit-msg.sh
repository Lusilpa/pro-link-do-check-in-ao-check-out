#!/bin/sh

# Padrão de validação para Conventional Commits com suporte a emojis
commit_msg_file=$1
commit_message=$(cat "$commit_msg_file")

# Expressão regular para validar o formato: [Emoji opcional] tipo(escopo): descrição ou tipo: descrição
# Tipos permitidos: feat, fix, docs, test, build, perf, style, refactor, chore, ci, raw, cleanup, remove
pattern="^(\p{So}|\p{Cn})?[\ ]*(feat|fix|docs|test|build|perf|style|refactor|chore|ci|raw|cleanup|remove)(\(.+\))?!?: .+$"

# Validação simples caso o ambiente não suporte unicode properties no grep
# Alternativa robusta focada no Conventional Commits
if ! echo "$commit_message" | grep -qE '^((\p{So}|\p{Cs})[ ]*)?(feat|fix|docs|test|build|perf|style|refactor|chore|ci|raw|cleanup|remove)(\(.+\))?: .+'; then
    echo "\033[31mErro: Sua mensagem de commit não segue o padrão Conventional Commits.\033[0m"
    echo "\033[33mExemplo correto: feat: descrição da alteração\033[0m"
    exit 1
fi