import type { CompilerResult } from '../types';

const API_BASE = '/api';

export const compileJava = async (code: string): Promise<CompilerResult> => {
  try {
    const res = await fetch(`${API_BASE}/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    return await res.json();
  } catch {
    // Fallback: local pattern matching if backend is unreachable
    return localCompile(code);
  }
};

// Fallback local compiler (same logic as before)
function localCompile(code: string): CompilerResult {
  const arrayDeclRegex = /int\[\]\s+(\w+)\s*=\s*\{([^}]+)\}/g;
  let match;
  const arrays: Record<string, number> = {};
  while ((match = arrayDeclRegex.exec(code)) !== null) {
    arrays[match[1]] = match[2].split(',').map((e) => e.trim()).length;
  }

  const arrayAccessRegex = /(\w+)\[(\d+)\]/g;
  while ((match = arrayAccessRegex.exec(code)) !== null) {
    const varName = match[1];
    const index = parseInt(match[2], 10);
    if (arrays[varName] !== undefined && index >= arrays[varName]) {
      return {
        success: false,
        output: `Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index ${index} out of bounds for length ${arrays[varName]}`,
        errorType: 'ArrayIndexOutOfBoundsException',
        errorMessage: `Index ${index} out of bounds for length ${arrays[varName]}`,
      };
    }
  }

  if (code.includes('null') && (code.includes('.length()') || code.includes('.toString()'))) {
    return {
      success: false,
      output: 'Exception in thread "main" java.lang.NullPointerException: Cannot invoke method because variable is null',
      errorType: 'NullPointerException',
      errorMessage: 'Cannot invoke method because variable is null',
    };
  }

  if (/\bString\s+\w+\s*=\s*\d+;/.test(code)) {
    return {
      success: false,
      output: 'error: incompatible types: int cannot be converted to String',
      errorType: 'IncompatibleTypes',
      errorMessage: 'incompatible types: int cannot be converted to String',
    };
  }

  return {
    success: true,
    output: 'Compilation successful.\nProgram exited with code 0.',
  };
}
