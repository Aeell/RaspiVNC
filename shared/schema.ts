import { z } from "zod";

export const vncConnectionSchema = z.object({
  host: z.string().min(1, "Host is required"),
  port: z.number().min(1).max(65535),
  password: z.string().optional(),
  quality: z.number().min(0).max(9).default(6),
});

export const vncMessageSchema = z.object({
  type: z.enum(['connect', 'disconnect', 'mouse', 'keyboard', 'resize']),
  data: z.any(),
});

export type VncConnection = z.infer<typeof vncConnectionSchema>;
export type VncMessage = z.infer<typeof vncMessageSchema>;

export interface VncStats {
  frameRate: number;
  bandwidth: number;
  latency: number;
  resolution: string;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'failed';
