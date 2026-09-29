import type { DemoStep } from '../types';

export const demoSteps: DemoStep[] = [
  {
    step: 1,
    title: 'Encounter a New Error',
    description:
      'Run this code to hit an ArrayIndexOutOfBoundsException. The AI will explain what went wrong.',
    code: `public class Main {
    public static void main(String[] args) {
        int[] numbers = {10, 20, 30};

        System.out.println(numbers[5]);
    }
}`,
    action: 'run',
  },
  {
    step: 2,
    title: 'Hindsight Memory Storage',
    description:
      'This is a new error type — click "Remember This Error" to store it in your Hindsight Memory.',
  },
  {
    step: 3,
    title: 'A Familiar Mistake',
    description:
      'Now we write new code with a similar mistake. Click Run to see BugMind recognize the pattern.',
    code: `public class Main {
    public static void main(String[] args) {
        int[] marks = {70, 80, 90};

        System.out.println(marks[10]);
    }
}`,
    action: 'run',
  },
  {
    step: 4,
    title: 'Fix and Learn',
    description:
      'The code is fixed. Click Run to see the successful compilation — BugMind will remember this fix.',
    code: `public class Main {
    public static void main(String[] args) {
        int[] marks = {70, 80, 90};

        System.out.println(marks[2]);
    }
}`,
    action: 'run',
  },
  {
    step: 5,
    title: 'Review Your Insights',
    description:
      'Navigate to the Insights page to see your coding patterns and recurring mistakes.',
    action: 'navigate-insights',
  },
];
