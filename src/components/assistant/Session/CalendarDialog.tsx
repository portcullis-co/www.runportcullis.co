import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CalendarDialog: React.FC<CalendarDialogProps> = ({ 
  open, 
  onClose,
}) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Only inject the script when the dialog is open
    if (open && calendarRef.current) {
      // Clear any previous content
      while (calendarRef.current.firstChild) {
        calendarRef.current.removeChild(calendarRef.current.firstChild);
      }
      
      // Create the Cal container div
      const calContainer = document.createElement('div');
      calContainer.id = 'my-cal-inline';
      calContainer.style.width = '100%';
      calContainer.style.height = '100%';
      calContainer.style.overflow = 'scroll';
      calendarRef.current.appendChild(calContainer);
      
      // Create and inject the script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = `
        (function (C, A, L) { 
          let p = function (a, ar) { a.q.push(ar); }; 
          let d = C.document; 
          C.Cal = C.Cal || function () { 
            let cal = C.Cal; 
            let ar = arguments; 
            if (!cal.loaded) { 
              cal.ns = {}; 
              cal.q = cal.q || []; 
              d.head.appendChild(d.createElement("script")).src = A; 
              cal.loaded = true; 
            } 
            if (ar[0] === L) { 
              const api = function () { p(api, arguments); }; 
              const namespace = ar[1]; 
              api.q = api.q || []; 
              if(typeof namespace === "string"){
                cal.ns[namespace] = cal.ns[namespace] || api;
                p(cal.ns[namespace], ar);
                p(cal, ["initNamespace", namespace]);
              } else p(cal, ar); 
              return;
            } 
            p(cal, ar); 
          }; 
        })(window, "https://app.cal.com/embed/embed.js", "init");
        
        Cal("init", "portcullis-intro", {origin:"https://cal.com"});
        
        Cal.ns["portcullis-intro"]("inline", {
          elementOrSelector: "#my-cal-inline",
          config: {"layout":"month_view","theme":"light"},
          calLink: "team/portcullis/portcullis-intro",
        });
        
        Cal.ns["portcullis-intro"]("ui", {
          "theme":"light",
          "cssVarsPerTheme":{"light":{"cal-brand":"#ffffff"}},
          "hideEventTypeDetails":false,
          "layout":"month_view"
        });
      `;
      calendarRef.current.appendChild(script);
    }
    
    // Cleanup function
    return () => {
      if (calendarRef.current) {
        while (calendarRef.current.firstChild) {
          calendarRef.current.removeChild(calendarRef.current.firstChild);
        }
      }
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] h-[80vh] p-0">
        <DialogHeader className="p-6 pb-2">
          <div className="flex justify-between items-center w-full">
            <DialogTitle>Schedule a Meeting</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Select a time that works for you to speak with our team.
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 pt-2 h-[calc(80vh-100px)]" ref={calendarRef}></div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarDialog; 