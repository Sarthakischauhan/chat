export const aiRegistryConfig = {
  defaultProviderId: "openai",
  providers: [
    {
      id: "openai",
      label: "Symphony",
      defaultModel: "gpt-5.6-luna",
      models: [{ id: "gpt-5.6-luna", label: "GPT-5.6 Luna" }],
    },
  ],
};
