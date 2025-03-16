// Simple file-based logging utility
import { supabase } from "@/lib/supabase";

// Log levels
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR"
}

// Log entry interface
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

// In-memory log storage
const logs: LogEntry[] = [];

// Maximum number of logs to keep in memory
const MAX_LOGS = 100;

/**
 * Log a message with optional data
 */
export const log = async (level: LogLevel, message: string, data?: any): Promise<void> => {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    data: data ? JSON.parse(JSON.stringify(data)) : undefined
  };
  
  // Add to in-memory logs
  logs.push(entry);
  
  // Trim logs if they exceed the maximum
  if (logs.length > MAX_LOGS) {
    logs.shift();
  }
  
  // Log to console
  const consoleMessage = `[${entry.timestamp}] [${level}] ${message}`;
  switch (level) {
    case LogLevel.DEBUG:
      console.log(consoleMessage, data);
      break;
    case LogLevel.INFO:
      console.info(consoleMessage, data);
      break;
    case LogLevel.WARN:
      console.warn(consoleMessage, data);
      break;
    case LogLevel.ERROR:
      console.error(consoleMessage, data);
      break;
  }
  
  // Store in Supabase if available
  try {
    await supabase.from("logs").insert([{
      level: level,
      message: message,
      data: data,
      created_at: entry.timestamp
    }]);
  } catch (error) {
    // Silently fail if we can't log to Supabase
    console.error("Failed to store log in Supabase:", error);
  }
};

/**
 * Convenience methods for different log levels
 */
export const debug = (message: string, data?: any) => log(LogLevel.DEBUG, message, data);
export const info = (message: string, data?: any) => log(LogLevel.INFO, message, data);
export const warn = (message: string, data?: any) => log(LogLevel.WARN, message, data);
export const error = (message: string, data?: any) => log(LogLevel.ERROR, message, data);

/**
 * Get all logs
 */
export const getLogs = (): LogEntry[] => {
  return [...logs];
};

/**
 * Clear all logs
 */
export const clearLogs = (): void => {
  logs.length = 0;
};

export default {
  log,
  debug,
  info,
  warn,
  error,
  getLogs,
  clearLogs
}; 