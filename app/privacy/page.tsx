'use client'
import { useLanguage } from '@/contexts/LanguageContext'

export default function PrivacyPage() {
  const { lang } = useLanguage()

  if (lang === 'es') return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Política de Privacidad</h1>
      <p className="text-gray-500 text-sm mb-10">Última actualización: marzo 2026</p>

      <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-white font-semibold text-base mb-2">1. Qué información recopilamos</h2>
          <p>Cuando creas una cuenta guardamos tu correo electrónico y preferencias de búsqueda (rutas y fechas de alerta). Si te suscribes a un plan de pago, el procesamiento del pago lo hace Stripe — nosotros no guardamos datos de tu tarjeta.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">2. Cómo usamos tu información</h2>
          <p>Usamos tu correo para enviarte alertas de disponibilidad que tú actives y para comunicaciones importantes sobre tu cuenta. No vendemos ni compartimos tu información con terceros para fines de marketing.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">3. Alertas y notificaciones</h2>
          <p>Las alertas de asientos (SMS y correo) solo se envían cuando tú las activas para una ruta específica. Puedes desactivar cualquier alerta desde tu cuenta en cualquier momento.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">4. Cookies</h2>
          <p>Usamos cookies únicamente para recordar tu sesión y tus preferencias de idioma. No usamos cookies de seguimiento ni publicidad.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">5. Seguridad</h2>
          <p>Tu información se almacena de forma segura. Los pagos se procesan con cifrado SSL a través de Stripe, que cumple con los estándares PCI DSS.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">6. Tus derechos</h2>
          <p>Puedes solicitar la eliminación de tu cuenta y todos tus datos en cualquier momento escribiéndonos a <span className="text-green-400">hola@volarfacil.com</span>. Respondemos en menos de 48 horas.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">7. Contacto</h2>
          <p>¿Preguntas sobre tu privacidad? Escríbenos a <span className="text-green-400">hola@volarfacil.com</span></p>
        </section>
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-10">Last updated: March 2026</p>

      <div className="space-y-8 text-gray-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-white font-semibold text-base mb-2">1. What information we collect</h2>
          <p>When you create an account we store your email address and search preferences (routes and alert dates). If you subscribe to a paid plan, payment processing is handled by Stripe — we never store your card details.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">2. How we use your information</h2>
          <p>We use your email to send seat availability alerts you activate and important account communications. We do not sell or share your information with third parties for marketing purposes.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">3. Alerts and notifications</h2>
          <p>Seat alerts (SMS and email) are only sent when you activate them for a specific route. You can turn off any alert from your account at any time.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">4. Cookies</h2>
          <p>We use cookies only to remember your session and language preference. We do not use tracking or advertising cookies.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">5. Security</h2>
          <p>Your information is stored securely. Payments are processed with SSL encryption through Stripe, which is PCI DSS compliant.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">6. Your rights</h2>
          <p>You can request deletion of your account and all your data at any time by emailing <span className="text-green-400">hello@volarfacil.com</span>. We respond within 48 hours.</p>
        </section>
        <section>
          <h2 className="text-white font-semibold text-base mb-2">7. Contact</h2>
          <p>Privacy questions? Email us at <span className="text-green-400">hello@volarfacil.com</span></p>
        </section>
      </div>
    </div>
  )
}
