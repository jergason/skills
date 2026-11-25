type Provider = {
  sendEmail: (to: string, subject: string, html: string) => Promise<{ id: string }>;
  sendSmsBatch: (
    messages: ReadonlyArray<{ to: string; text: string }>,
  ) => Promise<ReadonlyArray<{ id: string; receipt: boolean }>>;
  sendPush: (deviceToken: string, title: string, body: string) => Promise<{ id: string }>;
};

export type { Provider };
