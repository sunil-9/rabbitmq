export type ApiResponse = null | {
  data: Array<{ _id: string; name: string; message: string; createdAt: Date }>;
  success: boolean;
};
