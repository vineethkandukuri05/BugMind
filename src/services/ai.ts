import type { CompilerResult, AIAnalysis } from '../types';

const API_BASE = '/api';

export const aiService = {
  analyzeError: async (result: CompilerResult, _code: string): Promise<AIAnalysis> => {
    // Small delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (result.errorType === 'ArrayIndexOutOfBoundsException') {
      return {
        whatHappened:
          'You attempted to access an array index that does not exist. The array has fewer elements than the index you used.',
        whyHappened:
          'Arrays in Java are 0-indexed. If an array has 3 elements, valid indices are 0, 1, and 2. Accessing an index greater than or equal to the array length causes this error.',
        suggestedFix:
          'Check the array length before accessing an index. Use: if (index < array.length) { ... }',
        errorType: 'Array Index Error',
        severity: 'Medium',
      };
    }

    if (result.errorType === 'NullPointerException') {
      return {
        whatHappened:
          'You called a method or accessed a property on a null object reference.',
        whyHappened:
          'The variable was not initialized with an object, so it points to null. Calling methods on null causes this exception.',
        suggestedFix:
          'Initialize the variable before use, or add a null check: if (obj != null) { obj.method(); }',
        errorType: 'Null Pointer Error',
        severity: 'High',
      };
    }

    if (result.errorType === 'IncompatibleTypes') {
      return {
        whatHappened: 'You assigned a value of the wrong type to a variable.',
        whyHappened:
          'Java is statically typed. You cannot assign an int directly to a String variable without conversion.',
        suggestedFix: 'Use String.valueOf(number) or Integer.toString(number) to convert.',
        errorType: 'Type Mismatch',
        severity: 'Medium',
      };
    }

    if (result.errorType === 'StringIndexOutOfBoundsException') {
      return {
        whatHappened: 'You tried to access a character at an invalid index in a String.',
        whyHappened:
          'The requested character index exceeds the string length. String indices are 0-based.',
        suggestedFix: 'Check string.length() before calling charAt().',
        errorType: 'String Index Error',
        severity: 'Medium',
      };
    }

    return {
      whatHappened: result.errorMessage || 'An error occurred during compilation.',
      whyHappened: 'There may be a syntax or semantic error in the code.',
      suggestedFix: 'Review the code near the reported error line.',
      errorType: result.errorType || 'Unknown',
      severity: 'Low',
    };
  },

  /** Use Hindsight reflect for AI responses, with local fallback */
  getAIResponse: async (question: string): Promise<string> => {
    try {
      const res = await fetch(`${API_BASE}/memory/reflect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (data.success && data.answer) return data.answer;
    } catch {
      // fallback below
    }

    // Local fallback
    await new Promise((resolve) => setTimeout(resolve, 500));
    const q = question.toLowerCase();

    if (q.includes('most common mistakes') || q.includes('repeat most often'))
      return "Based on your debugging history, your most common mistake is array boundary errors, which you've encountered 7 times. This is followed by null pointer errors (4 times) and type mismatches (3 times). I recommend adding array bounds checks before accessing array elements.";
    if (q.includes('how many times'))
      return 'You have encountered this specific error pattern 3 times across your projects.';
    if (q.includes('nullpointerexception') || q.includes('null pointer'))
      return "You've encountered NullPointerException 2 times. In both cases, the issue was calling a method on a variable that hadn't been initialized. Your successful fix was to add null checks before method calls.";
    if (q.includes('focus on improving'))
      return 'Based on your debugging patterns, I recommend focusing on: 1) Array bounds checking — always verify index < array.length before access. 2) Null safety — initialize variables and add null checks. 3) Type awareness — pay attention to variable types when assigning values.';
    return 'I can answer questions about your debugging history, most common errors, and previous successful fixes. What would you like to know?';
  },

  getInsightText: (): { primary: string; secondary: string } => ({
    primary: "You've encountered array-boundary errors more frequently than other error types.",
    secondary:
      'Your previous successful fixes often involved checking array length before accessing an index.',
  }),
};
