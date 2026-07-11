"use client";

import React from "react";
import { ExternalLink, FileText } from "lucide-react";

/**
 * Shared layout Footer for the Training & Placement Cell Portal.
 * Renders contact details, quick navigation links, and an embedded map of the NITPY campus.
 */
export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-luna-950 text-slate-300 pt-16 pb-8 font-serif">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Branding Column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assests/college_logo.png"
                alt="NITPY Logo"
                className="h-12 w-auto object-contain rounded-full bg-white/20 p-1"
              />
              <div>
                <h4 className="text-base font-bold font-sans text-white tracking-wider">NIT PUDUCHERRY</h4>
                <p className="text-[10px] text-luna-300 font-bold uppercase tracking-wider">
                  Training & Placement Cell
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6 font-serif">
              National Institute of Technology Puducherry is an autonomous premier public technical institution
              established in 2009 under the 11th Five Year Plan by the Ministry of Education, Govt. of India in Karaikal.
            </p>
            <div className="text-xs text-slate-400">
              &copy; {new Date().getFullYear()} NIT Puducherry. All rights reserved.
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="font-sans">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-luna-300 pl-3">
              Quick Navigation
            </h5>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <a href="#/home" className="hover:text-luna-300 transition-colors">Home Cell</a>
              <a href="#/vision" className="hover:text-luna-300 transition-colors">Placement Vision</a>
              <a href="#/about" className="hover:text-luna-300 transition-colors">Pre-Placement Gym</a>
              <a href="#/home" className="hover:text-luna-300 transition-colors">Salary CTC Stats</a>
              <a href="#/home" className="hover:text-luna-300 transition-colors">Alumni Stories</a>
              <a href="#/team" className="hover:text-luna-300 transition-colors">Our Team</a>
              <a href="#/home" className="hover:text-luna-300 transition-colors">Recruiters Grid</a>
              <a
                href="https://nitpy.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-luna-300 transition-colors flex items-center gap-1"
              >
                NITPY Official <ExternalLink size={10} />
              </a>
              <a
                href="/assests/NITPY Placement Brochure 2026-27.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-luna-300 transition-colors flex items-center gap-1"
              >
                Brochure 2026-27 <FileText size={10} />
              </a>
              <a
                href="/assests/NITPY Placement Brochure 2025-26 (6).pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-luna-300 transition-colors flex items-center gap-1"
              >
                Brochure 2025-26 <FileText size={10} />
              </a>
            </div>
          </div>

          {/* Mini Map of NITPY Campus */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-luna-300 pl-3 font-sans">
              Campus Location
            </h5>
            <div className="h-44 w-full rounded-2xl overflow-hidden border border-white/10 relative shadow-md">
              <iframe
                title="NITPY Location Map"
                src="https://maps.google.com/maps?q=10.9854749,79.8452527+(National%20Institute%20of%20Technology%20Puducherry)&z=16&output=embed"
                className="w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 text-center text-[10px] text-slate-500 flex flex-wrap justify-between items-center">
          <div>Designed & Developed for NITPY Placement Cell.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Placement Policy</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Norms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
