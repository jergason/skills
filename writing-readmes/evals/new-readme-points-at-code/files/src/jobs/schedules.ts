const schedules: Readonly<Record<string, string>> = {
  sendDigest: '0 7 * * *',
  purgeExpiredSessions: '*/15 * * * *',
  rebuildSearchIndex: '30 3 * * *',
};

export { schedules };
