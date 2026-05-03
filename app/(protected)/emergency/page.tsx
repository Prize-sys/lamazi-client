'use client';

import { useState, useEffect } from 'react';
import { Phone, MessageCircle, Globe, Heart, ExternalLink, Loader } from 'lucide-react';

interface EmergencyResource {
  id: string;
  name: string;
  description?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  country: string;
  category: string;
}

// Fallback Kenyan resources if API unavailable
const FALLBACK_RESOURCES: EmergencyResource[] = [
  { id: 'f1', name: 'Befrienders Kenya', description: 'Free emotional support and suicide prevention', phone: '0722 178 177', website: 'https://www.befrienderskenya.org', country: 'Kenya', category: 'suicide_prevention' },
  { id: 'f2', name: 'Kenya Red Cross', description: 'Emergency and psychosocial support', phone: '1199', website: 'https://www.redcross.or.ke', country: 'Kenya', category: 'general' },
  { id: 'f3', name: 'Mathare Hospital Emergency', description: '24-hour psychiatric emergency services', phone: '020 2012191', country: 'Kenya', category: 'psychiatric' },
  { id: 'f4', name: 'Kenya Police Emergency', description: 'Immediate danger — police emergency line', phone: '999', country: 'Kenya', category: 'emergency' },
  { id: 'f5', name: 'Ambulance (Kenya)', description: 'Medical emergency ambulance services', phone: '112', country: 'Kenya', category: 'emergency' },
  { id: 'f6', name: 'Domestic Violence Hotline Kenya', description: 'Support for gender-based violence survivors', phone: '1195', country: 'Kenya', category: 'domestic_violence' },
];

const CATEGORY_COLORS: Record<string, string> = {
  suicide_prevention: 'bg-red-100 text-red-600',
  psychiatric: 'bg-purple-100 text-purple-600',
  emergency: 'bg-red-100 text-red-600',
  domestic_violence: 'bg-orange-100 text-orange-600',
  general: 'bg-blue-100 text-blue-600',
  default: 'bg-gray-100 text-gray-600',
};

export default function EmergencyPage() {
  const [resources, setResources] = useState<EmergencyResource[]>([]);
  const [crisisMessage, setCrisisMessage] = useState('If you are in immediate danger, please call emergency services (999 or 112).');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/emergency-resources?country=Kenya`
        );
        if (res.ok) {
          const data = await res.json();
          setResources(data.resources || FALLBACK_RESOURCES);
          if (data.crisis_message) setCrisisMessage(data.crisis_message);
        } else {
          setResources(FALLBACK_RESOURCES);
        }
      } catch {
        setResources(FALLBACK_RESOURCES);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const getCategoryColor = (cat: string) =>
    CATEGORY_COLORS[cat] || CATEGORY_COLORS.default;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Alert Banner */}
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-red-900 mb-2">You Are Not Alone</h2>
            <p className="text-red-800 text-sm mb-4 leading-relaxed">
              If you are in immediate danger or experiencing a mental health crisis,
              please contact emergency services or use one of the resources below.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:999"
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
              >
                <Phone className="w-4 h-4" />
                Call 999 — Police
              </a>
              <a
                href="tel:112"
                className="flex items-center gap-2 px-5 py-2.5 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors font-medium text-sm"
              >
                <Phone className="w-4 h-4" />
                Call 112 — Ambulance
              </a>
            </div>
            <p className="text-xs text-red-600 mt-3 font-medium">{crisisMessage}</p>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Crisis &amp; Support Resources — Kenya</h3>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Loading resources...</p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {resources.map(resource => (
              <div
                key={resource.id}
                className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getCategoryColor(resource.category)}`}>
                    {resource.phone ? (
                      <Phone className="w-5 h-5" />
                    ) : (
                      <MessageCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{resource.name}</h4>
                    {resource.description && (
                      <p className="text-gray-600 text-sm mb-3 leading-relaxed">{resource.description}</p>
                    )}
                    <div className="space-y-1.5">
                      {resource.phone && (
                        <a
                          href={`tel:${resource.phone.replace(/\s/g, '')}`}
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {resource.phone}
                        </a>
                      )}
                      {resource.whatsapp && (
                        <a
                          href={`https://wa.me/${resource.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          WhatsApp: {resource.whatsapp}
                        </a>
                      )}
                      {resource.website && (
                        <a
                          href={resource.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* When to Seek Help */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-semibold text-blue-900 mb-3">When to Seek Immediate Help</h4>
        <ul className="space-y-2 text-blue-800 text-sm">
          {[
            'Thinking about hurting yourself or others',
            'Feeling hopeless or having no reason to live',
            'Experiencing unbearable emotional or physical pain',
            'Seeing or hearing things that aren\'t there',
            'Feeling out of control or unable to cope',
          ].map(item => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="text-blue-900 font-medium mt-4 text-sm">
          Remember: Reaching out for help is a sign of strength, not weakness.
        </p>
      </div>

      {/* Online Resources */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Online Resources</h3>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Mental Health Kenya', desc: 'National mental health advocacy and resources', url: 'https://mentalhealthkenya.org' },
            { name: 'Kenya Medical Research Institute', desc: 'Evidence-based mental health information', url: 'https://www.kemri.go.ke' },
            { name: 'Africa Mental Health Foundation', desc: 'Pan-African mental health support', url: 'https://africamentalhealthfoundation.org' },
          ].map(link => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{link.name}</h4>
                  <p className="text-gray-500 text-xs mt-0.5">{link.desc}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
