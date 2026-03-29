'use client'
import { useLanguage } from '@/contexts/LanguageContext'

export default function TermsPage() {
  const { lang } = useLanguage()

  if (lang === 'es') return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Términos de Uso</h1>
      <p className="text-gray-500 text-sm mb-10">Última actualización: marzo 2026</p>

      <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-white font-semibold text-base mb-2">1. Qué es VolarFácil</h2>
          <p>VolarFácil es una herramienta independiente que te ayuda a encontrar disponibilidad de asientos en el Pase Anual de Volaris. No somos parte de Volaris ni tenemos ninguna relación con ellos. Todas las reservaciones se hacen directamente en la plataforma de Volaris.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">2. Uso del servicio</h2>
          <p>Al usar VolarFácil aceptas usarlo solo para fines personales y legales. No puedes usar la plataforma para revender acceso, hacer scraping masivo o cualquier actividad que perjudique a otros usuarios o al servicio.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">3. Exactitud de la información</h2>
          <p>Hacemos nuestro mejor esfuerzo para mostrarte disponibilidad en tiempo real, pero no garantizamos que la información sea 100% precisa en todo momento. Los precios y disponibilidad los controla Volaris, no nosotros. Siempre confirma tu reservación directamente en la plataforma de Volaris.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">4. Suscripciones y pagos</h2>
          <p>Los planes de pago se cobran mensualmente. Puedes cancelar cuando quieras desde tu cuenta. No hay reembolsos por el mes en curso, pero no te cobramos por los meses siguientes después de cancelar.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">5. Limitación de responsabilidad</h2>
          <p>VolarFácil no se hace responsable por vuelos perdidos, reservaciones fallidas, cambios de Volaris en su plataforma, o cualquier daño derivado del uso o falta de disponibilidad de este servicio.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">6. Cambios a estos términos</h2>
          <p>Podemos actualizar estos términos en cualquier momento. Si los cambios son importantes, te avisaremos por correo. Seguir usando VolarFácil después de los cambios significa que los aceptas.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">7. Contacto</h2>
          <p>¿Preguntas? Escríbenos a <span className="text-green-400">hola@volarfacil.com</span></p>
        </section>
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Terms of Use</h1>
      <p className="text-gray-500 text-sm mb-10">Last updated: March 2026</p>

      <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-white font-semibold text-base mb-2">1. What is VolarFácil</h2>
          <p>VolarFácil is an independent tool that helps you find seat availability on the Volaris Annual Pass. We are not affiliated with Volaris in any way. All bookings are made directly on the Volaris platform.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">2. Use of the service</h2>
          <p>By using VolarFácil you agree to use it only for personal and lawful purposes. You may not use the platform to resell access, mass scrape data, or engage in any activity that harms other users or the service.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">3. Accuracy of information</h2>
          <p>We make our best effort to show real-time availability, but we do not guarantee that information is 100% accurate at all times. Prices and availability are controlled by Volaris, not us. Always confirm your booking directly on the Volaris platform.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">4. Subscriptions and payments</h2>
          <p>Paid plans are billed monthly. You can cancel anytime from your account. No refunds for the current billing period, but you will not be charged for subsequent months after cancellation.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">5. Limitation of liability</h2>
          <p>VolarFácil is not responsible for missed flights, failed bookings, changes to the Volaris platform, or any damages arising from the use or unavailability of this service.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">6. Changes to these terms</h2>
          <p>We may update these terms at any time. If changes are significant, we will notify you by email. Continued use of VolarFácil after changes means you accept them.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">7. Contact</h2>
          <p>Questions? Email us at <span className="text-green-400">hello@volarfacil.com</span></p>
        </section>
      </div>
    </div>
  )
}
