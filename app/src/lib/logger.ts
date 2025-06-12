interface LogContext {
  method?: string;
  url?: string;
  userId?: string;
  body?: unknown;
  params?: Record<string, unknown>;
  [key: string]: unknown;
}

class Logger {
  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(
    level: string,
    message: string,
    context?: LogContext
  ): string {
    const timestamp = this.formatTimestamp();
    const contextStr = context
      ? `\n  Context: ${JSON.stringify(context, null, 2)}`
      : "";

    return `
🔥 [${level}] ${timestamp}
📝 Message: ${message}${contextStr}
${"=".repeat(80)}
`;
  }

  info(message: string, context?: LogContext): void {
    const formatted = this.formatMessage("INFO", message, context);
    console.log(formatted);
  }

  warn(message: string, context?: LogContext): void {
    const formatted = this.formatMessage("WARN", message, context);
    console.warn(formatted);
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorDetails =
      error instanceof Error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : error;

    const fullContext: LogContext = {
      ...(context || {}),
      ...(errorDetails && typeof errorDetails === "object"
        ? { error: errorDetails }
        : {}),
    };

    const formatted = this.formatMessage("ERROR", message, fullContext);

    // Force output to stderr to ensure visibility
    console.error(formatted);

    // Also log to stdout as backup
    console.log(formatted);

    // In development, also throw to ensure the error is caught
    if (process.env.NODE_ENV === "development") {
      console.trace("Stack trace for debugging:");
    }
  }

  apiRequest(method: string, url: string, context?: LogContext): void {
    this.info(`API Request: ${method} ${url}`, {
      method,
      url,
      ...context,
    });
  }

  apiResponse(
    method: string,
    url: string,
    status: number,
    context?: LogContext
  ): void {
    const level = status >= 400 ? "ERROR" : status >= 300 ? "WARN" : "INFO";
    const message = `API Response: ${method} ${url} - ${status}`;

    if (level === "ERROR") {
      this.error(message, undefined, { method, url, status, ...context });
    } else if (level === "WARN") {
      this.warn(message, { method, url, status, ...context });
    } else {
      this.info(message, { method, url, status, ...context });
    }
  }
}

export const logger = new Logger();

// Helper function to extract request context
export function getRequestContext(request: Request): LogContext {
  const url = new URL(request.url);
  return {
    method: request.method,
    url: request.url,
    pathname: url.pathname,
    searchParams: Object.fromEntries(url.searchParams.entries()),
  };
}

// Helper function to safely stringify request body
export async function getRequestBody(request: Request): Promise<unknown> {
  try {
    const cloned = request.clone();
    const body = await cloned.json();
    return body;
  } catch {
    return null;
  }
}
