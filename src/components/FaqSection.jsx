/**
 * Sezione FAQ con accordion DaisyUI — chiusura automatica.
 * type="radio" con stesso name garantisce che un solo item sia aperto alla volta.
 *
 * Props:
 *  - faqs: array di { question: string, answer: string }
 */
export default function FaqSection({ faqs = [] }) {
  return (
    <section className="py-16 relative">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Intestazione sezione */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-base-content">Frequently asked questions</h2>
          <p className="mt-3 text-base-content/60 text-sm sm:text-base">
            Everything you want to know. And a bit more.
          </p>
        </div>

        {/* Lista accordion — radio per chiusura automatica */}
        <div className="flex flex-col gap-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="collapse collapse-arrow bg-base-200 border border-base-300 rounded-box"
            >
              {/* Stesso name per tutti: un solo radio selezionato alla volta */}
              <input type="radio" name="faq-group" />

              <div className="collapse-title font-semibold text-base-content">
                {faq.question}
              </div>

              <div className="collapse-content text-sm text-base-content/70 leading-relaxed">
                <p className="whitespace-pre-line">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
