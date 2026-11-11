interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="border-l-4 border-primary-500 pl-4 text-2xl font-bold text-navy-900 sm:text-3xl">{title}</h1>
      <div className="mt-8 min-h-[40vh]" />
    </section>
  );
}
