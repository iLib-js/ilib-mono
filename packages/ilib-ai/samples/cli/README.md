# ilib-ai CLI sample

A minimal interactive command-line app that uses **ilib-ai** to send prompts to an AI provider and print the text response.

## Prerequisites

- **Node.js 18+**
- **ilib-ai built** (the sample imports the compiled package):

  ```bash
  cd packages/ilib-ai
  pnpm build
  ```

## Install

From this directory:

```bash
pnpm install
```

Or from the monorepo root: `pnpm install --filter ilib-ai-cli-sample`.

## Credentials

Credentials are read from a **JSON file in the current working directory** (the directory from which you run the CLI). Paths inside the JSON file are also resolved relative to that directory.

### Setup

```bash
cp credentials.example.json credentials.json
```

Edit **`credentials.json`** and add your **`apiKey`** (and any other fields your adapter needs). **`credentials.json`** is gitignored.

### OpenAI (default adapter)

Minimal **`credentials.json`**:

```json
{
  "apiKey": "sk-your-key-here",
  "baseUrl": "https://api.openai.com",
  "defaultModel": "gpt-4o-mini"
}
```

### Box AI

Use **`--model box-ai`** and a credentials file with Box fields, for example:

```json
{
  "jwtConfigPath": "9999999_xxxxxxx_config.json",
  "contextFileId": "1234567890"
}
```

Place the Box JWT download next to **`credentials.json`** in the same directory.

## Run

Run from the directory that contains your credentials file:

```bash
cd packages/ilib-ai/samples/cli
cp credentials.example.json credentials.json
# edit credentials.json
pnpm run:sample
```

Defaults: **`credentials.json`** in the current directory, **OpenAI** adapter, default LLM from the adapter.

### `--credentials`

Name the credentials file (relative to the current directory):

```bash
pnpm run:sample -- --credentials my-openai.json
```

### `--model`

Select the **adapter** or **LLM model**:

```bash
# OpenAI adapter (default LLM from adapter capabilities)
pnpm run:sample -- --model openai

# Box AI adapter
pnpm run:sample -- --model box-ai --credentials box-credentials.json

# OpenAI adapter with a specific LLM model id
pnpm run:sample -- --model gpt-4o-mini
```

If **`--model`** is a known adapter id (`openai`, `box-ai`), that integration is used. Any other value is treated as an **LLM model id** with the OpenAI adapter.

## Interactive commands

| Input | Action |
|-------|--------|
| *(your text)* | Sent to the AI as the user prompt; response printed as plain text |
| **`.info`** | Prints credentials file, provider, LLM model, connection status, and capabilities |
| **`.exit`** | Ends the session |
| **Ctrl-D** (EOF) | Ends the session |

## Example session

```
Connecting to OpenAI…
Connected. LLM model: gpt-4o-2024-08-06. Type .info, .exit, or your prompt. Ctrl-D to quit.

> .info
Credentials:  credentials.json (current directory)
Provider:     OpenAI (openai)
LLM model:    gpt-4o-2024-08-06
Connected:    yes
…
> Say hello in one short sentence.
Hello! How can I help you today?
> .exit

Goodbye.
```
