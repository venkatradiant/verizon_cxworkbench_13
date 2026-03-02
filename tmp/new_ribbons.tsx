
            {/* User Interactions CTA - Light Purple */}
            {!isRightPanelCollapsed && activeTab === 'userInteractions' && (
              <div className="bg-purple-50 border-b border-purple-200 px-6 py-4 shrink-0">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <MousePointer2 size={20} className="text-purple-600" strokeWidth={2.5} />
                   <div className="flex flex-col">
                     <span className="text-[15px] font-black text-purple-900">
                       Review User Interactions
                     </span>
                     <span className="text-[12px] text-purple-700">
                       Validate click events, form interactions, and user actions
                     </span>
                   </div>
                 </div>
                 <button
                   onClick={() => setActiveTab('systemEvents')}
                   className="px-4 py-2 bg-white hover:bg-purple-50 text-purple-600 hover:text-purple-700 rounded-lg text-[12px] font-bold transition-all shadow-sm flex items-center gap-2"
                 >
                   Continue
                   <ArrowRight size={16} strokeWidth={2.5} />
                 </button>
               </div>
             </div>
            )}

            {/* System Events CTA - Light Emerald */}
            {!isRightPanelCollapsed && activeTab === 'systemEvents' && (
              <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-4 shrink-0">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <Activity size={20} className="text-emerald-600" strokeWidth={2.5} />
                   <div className="flex flex-col">
                     <span className="text-[15px] font-black text-emerald-900">
                       Review System Events
                     </span>
                     <span className="text-[12px] text-emerald-700">
                       Verify automated events and system-triggered analytics
                     </span>
                   </div>
                 </div>
                 <button
                   onClick={() => {
                     toast.success('Review Complete', {
                       description: 'All tracking definitions have been reviewed.',
                     });
                   }}
                   className="px-4 py-2 bg-white hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 rounded-lg text-[12px] font-bold transition-all shadow-sm flex items-center gap-2"
                 >
                   <CheckCircle2 size={16} strokeWidth={2.5} />
                   Complete Review
                 </button>
               </div>
             </div>
            )}
