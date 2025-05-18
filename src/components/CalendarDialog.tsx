import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Cal, { getCalApi } from "@calcom/embed-react";

interface CalendarDialogProps {
  open: boolean;
  onClose: () => void;
}

export const CalendarDialog: React.FC<CalendarDialogProps> = ({ 
  open, 
  onClose,
}) => {
  
  // Prevent hydration issues with the Cal embed
	useEffect(()=>{
	  (async function () {
		const cal = await getCalApi({"namespace":"portcullis-intro"});
		cal("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
	  })();
	}, [])

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
        <Cal namespace="portcullis-intro"
	  calLink="team/portcullis/portcullis-intro"
	  style={{width:"100%",height:"100%",overflow:"scroll"}}
	  config={{"layout":"month_view","theme":"light"}}
	/>;
      </DialogContent>
    </Dialog>
  );
};

export default CalendarDialog; 