import type { ReactNode } from 'react';
import { ChevronDown, Plus } from 'lucide-react';

interface AccordionItemProps {
  id: string;
  question: ReactNode;
  answer: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export function AccordionItem({ id, question, answer, isOpen, onToggle }: AccordionItemProps) {
  const panelId = `accordion-panel-${id}`;
  return (
    <div>
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors duration-200 hover:bg-primary-50/60"
        >
          <span className={`font-bold ${isOpen ? 'text-primary-600' : 'text-navy-900'}`}>{question}</span>
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
              isOpen ? 'rotate-180 bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-600'
            }`}
            aria-hidden="true"
          >
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 leading-relaxed text-neutral-600">{answer}</div>
        </div>
      </div>
    </div>
  );
}
