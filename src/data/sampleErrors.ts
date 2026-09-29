import type { AIAnalysis } from '../types';

export const sampleJavaCode = `public class Main {
    public static void main(String[] args) {
        int[] numbers = {10, 20, 30};
        // This will cause an ArrayIndexOutOfBoundsException
        System.out.println(numbers[5]);
    }
}`;

export const sampleAnalyses: Record<string, AIAnalysis> = {
  ArrayIndexOutOfBoundsException: {
    whatHappened: 'You tried to access an array element that does not exist.',
    whyHappened: 'Arrays in Java are 0-indexed. If an array has 3 elements, valid indices are 0, 1, and 2. Accessing index 5 is out of bounds.',
    suggestedFix: 'Change the index to be less than the array length. For example, use numbers[2] instead of numbers[5].',
    errorType: 'ArrayIndexOutOfBoundsException',
    severity: 'Medium'
  },
  NullPointerException: {
    whatHappened: 'You called a method on a null reference.',
    whyHappened: 'The object variable has not been initialized or was explicitly set to null.',
    suggestedFix: 'Initialize the object before calling its methods, or add a null check.',
    errorType: 'NullPointerException',
    severity: 'High'
  }
};
