import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Cal, { getCalApi } from "@calcom/embed-react";

interface CalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  calendarUrl?: string;
}

const CalendarDialog: React.FC<CalendarDialogProps> = ({
  open,
  onOpenChange,
  calendarUrl = "https://cal.com/team/portcullis/portcullis-intro",
}) => {
  const [isMounted, setIsMounted] = useState(false);

  // We need to check if the component is mounted
  // to avoid issues with hydration when using Cal.com embed
  useEffect(()=>{
    (async function () {
      const cal = await getCalApi({"namespace":"portcullis-intro"});
      cal("ui", {"hideEventTypeDetails":false,"layout":"month_view"});
    })();
  }, [])

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[800px] h-[700px] p-0">
        <DialogHeader className="px-6 pt-6 pb-3">
          <DialogTitle>Schedule a Meeting</DialogTitle>
          <DialogDescription>
            Please select a convenient time for us to discuss your data needs.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full h-full px-6 pb-6 overflow-hidden">
        <Cal namespace="portcullis-intro"
	  calLink="team/portcullis/portcullis-intro"
	  style={{width:"100%",height:"100%",overflow:"scroll"}}
	  config={{"layout":"month_view"}}/>;
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarDialog; 