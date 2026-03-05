# Web Interface Guidelines Directive

Review UI files for compliance with Web Interface Guidelines.

## Goal
Check the provided UI files or patterns against the best practices and Web Interface Guidelines, outputting the findings in `file:line` format.

## Process
1. Use `execution/check_web_guidelines.py` to process the files.
2. The script will fetch the latest guidelines from: `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
3. The script will read the specified files and analyze them.
4. If no files are specified, ask the user which files to review.

## Outputs
Terse output format: `file:line: description of issue`.
