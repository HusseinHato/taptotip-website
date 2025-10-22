import React, { useState } from 'react';
import { ArrowRight, Zap, Shield, Clock, QrCode, MessageSquare, Wallet, TrendingUp, CheckCircle, Users, Video, Code, Trophy, DollarSign, ChevronDown } from 'lucide-react';
import { useWeb3AuthConnect } from '@web3auth/modal/react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { connect } = useWeb3AuthConnect();

  const features = [
    {
      icon: <QrCode className="w-6 h-6" />,
      title: "Shareable Link & QR",
      description: "Personal URL and scannable code that land on your tip page instantly."
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Message with Tip",
      description: "Let supporters leave a few words with their contribution."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Gasless Transactions",
      description: "We sponsor gas so supporters don't have to. You receive the full tip minus our 1% fee."
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Authorize Once, 30 Days",
      description: "MetaMask Delegation Toolkit removes repeated approval pop-ups."
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      title: "Embedded Wallet Login",
      description: "One-tap login via MetaMask Web3 Auth — no extensions needed."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Revoke Anytime",
      description: "Full control over your delegated permissions from your settings."
    }
  ];

  const useCases = [
    { icon: <Video />, title: "Livestreams & Creators", desc: "Overlay your QR, pin your link, watch tips roll in mid-show." },
    { icon: <Users />, title: "Conferences & Meetups", desc: "Sticker your QR on a badge or booth." },
    { icon: <Code />, title: "Open-Source", desc: "Link from README to fund features/issues." },
    { icon: <Trophy />, title: "Hackathons", desc: "Collect peer tips and audience votes in seconds." }
  ];

  const faqs = [
    {
      q: "Do I need a crypto wallet to tip?",
      a: "No extensions required. MetaMask Embedded Wallet lets newcomers sign in quickly."
    },
    {
      q: "What happens after 30 days?",
      a: "Your authorization expires. Re-authorize in one tap to keep the pop-up-free flow."
    },
    {
      q: "Can I revoke authorization earlier?",
      a: "Yes. You can revoke anytime from your dashboard."
    },
    {
      q: "Where do my tips go?",
      a: "Directly to your wallet. TapToTip is non-custodial."
    },
    {
      q: "Who pays gas?",
      a: "We sponsor gas. You only see the tip amount and our 1% fee."
    },
    {
      q: "Which network and token?",
      a: "Currently MON (Monad, hackathon environment). More assets coming soon."
    },
    {
      q: "Is TapToTip safe?",
      a: "Delegations are scoped and time-boxed. You stay in control and can revoke at will."
    }
  ];

  return (
    <div className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                TapToTip
              </span>
            </h1>
            <p className="text-2xl sm:text-3xl text-gray-700 mb-4 font-semibold">
              One tap. Tip done.
            </p>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Frictionless crypto tipping with a shareable link or QR. No addresses. No pop-ups. No gas.
              <br />
              <span className="text-sm text-gray-500 mt-2 inline-block">
                Built with MetaMask Delegation Toolkit + Envio for speed, safety, and simplicity.
              </span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2" onClick={() => connect()}>
                Create your tip link
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white text-green-600 border-2 border-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-all duration-200" onClick={() => connect()}>
                Try the demo
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-green-600" /> Gasless
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-green-600" /> 1% fee
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-green-600" /> Revoke anytime
              </span>
              <span className="flex items-center gap-1">
                <Wallet className="w-4 h-4 text-green-600" /> MetaMask Embedded Wallet
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-green-600" /> Powered by Envio
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
            Tip in <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">seconds</span>, not minutes.
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">No copy-pasting addresses</h3>
              <p className="text-gray-600">Your unique link/QR routes tips straight to you.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">No approval spam</h3>
              <p className="text-gray-600">Authorize once every 30 days, then it's truly one-tap.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">No gas headaches</h3>
              <p className="text-gray-600">We sponsor gas; tippers pay exactly what they intend.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">No setup drama</h3>
              <p className="text-gray-600">Login with MetaMask Web3 Auth (Embedded Wallet).</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-8 text-gray-900">Who It's For</h3>
          <div className="flex flex-wrap justify-center gap-3 text-gray-700">
            {["Creators", "Streamers", "Event booths", "Hackathon teams", "OSS maintainers", "Community fundraisers"].map((item, i) => (
              <span key={i} className="px-5 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full text-sm font-medium border border-green-200">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-gray-900">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Create your profile", desc: "Get a personalized link + QR code instantly." },
              { step: "2", title: "Share it anywhere", desc: "Socials, stream overlay, slides, stickers — you name it." },
              { step: "3", title: "Get tipped in MON", desc: "With optional messages — no address entry, no pop-ups." }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why It's Different */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-gray-900">Why It's Different</h2>
          
          <div className="space-y-12">
            {/* Zero Friction */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 sm:p-12">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">⚡ Zero friction</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-500 font-semibold mb-2">Traditional wallets:</p>
                  <p className="text-gray-600 text-sm">copy address → paste → approve → sign → confirm → pay gas</p>
                </div>
                <div>
                  <p className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-semibold mb-2">TapToTip:</p>
                  <p className="text-gray-900 font-medium">open link → enter amount/message → tap once. Done.</p>
                </div>
              </div>
            </div>

            {/* Safer by Design */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8 sm:p-12">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">🛡️ Safer by design</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Delegation, not custody. You give the app limited permission that you can revoke anytime.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">30-day authorization window reduces repetitive signing risk and consent fatigue.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Tips go to you, not to a custodial middleman.</span>
                </li>
              </ul>
            </div>

            {/* Built for Speed */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 sm:p-12">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">🚀 Built for speed</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Envio indexes events and balances in real time for a responsive dashboard.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Gasless flow removes the slowest step of on-chain UX.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-gray-900">Feature Highlights</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-green-200">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-gray-900">Use Cases</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((uc, i) => (
              <div key={i} className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                <div className="text-green-600 mb-3">
                  {React.cloneElement(uc.icon, { className: "w-8 h-8" })}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{uc.title}</h3>
                <p className="text-sm text-gray-600">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Advantage */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-gray-900">Advanced Technology</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-4 text-gray-900">MetaMask Delegation Toolkit</h3>
              <p className="text-gray-600">Granular, time-boxed permissions so TapToTip can process your tips without nagging pop-ups. You remain in control and can revoke anytime.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Envio Indexer</h3>
              <p className="text-gray-600">Lightning-fast event tracking and state updates → live earnings, smooth dashboards, and reliable history.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Safety */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-gray-900">Security & Safety</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { title: "Non-custodial", desc: "TapToTip never holds your funds." },
              { title: "Revocable permissions", desc: "Turn off delegation with one click." },
              { title: "Scoped access", desc: "Only what's needed to process tips. Nothing more." },
              { title: "Transparent fee", desc: "Flat 1% per tip. No hidden costs." },
              { title: "Clear logs", desc: "See what's been authorized and when it expires." }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl">
                <Shield className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-gray-900">Pricing</h2>
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Pay as you earn</p>
                  <p className="text-gray-600 text-sm">1% fee on each tip</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Gas on us</p>
                  <p className="text-gray-600 text-sm">We sponsor gas to keep the flow frictionless</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">No monthly fees</p>
                  <p className="text-gray-600 text-sm">While in hackathon mode</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900">Creator Dashboard</h2>
          <p className="text-xl text-gray-600 mb-8">Your earnings, at a glance.</p>
          <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-700 mb-6">Live totals in MON, recent tippers, and messages — updated in real time by Envio.</p>
            <p className="text-sm text-gray-500 mb-8">Export and advanced analytics coming soon.</p>
            <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200" onClick={() => connect()}>
              Open my dashboard
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16 text-gray-900">FAQ</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 py-4 text-gray-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Start tipping the easy way.</h2>
          <p className="text-xl mb-8 text-green-50">Share your link or QR and get paid in seconds — no addresses, no gas, no pop-ups.</p>
          <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 inline-flex items-center gap-2" onClick={() => connect()}>
            Create your tip link
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}