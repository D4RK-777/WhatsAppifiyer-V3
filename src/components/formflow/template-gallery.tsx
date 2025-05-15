
"use client";

import type { FC } from 'react';

export interface TemplateItemProps {
  id: number;
  title: string;
  // imageUrl: string; // No longer strictly needed for display, but kept for data structure consistency if needed elsewhere.
  dataAiHint: string; // This will be used as the context (user's text/idea) for the AI
  messageType: "marketing" | "authentication" | "utility" | "service";
  templateContent: { 
    field1?: string; // Pre-filled content for variation 1
    field2?: string; // Pre-filled content for variation 2
    field3?: string; // Pre-filled content for variation 3
  };
  onClick: (template: TemplateItemProps) => void;
}

const TemplateItem: FC<TemplateItemProps> = (props) => {
  const { title, dataAiHint, templateContent, onClick } = props;
  const previewText = templateContent.field1?.split('\n').slice(0, 3).join('\n') + (templateContent.field1 && templateContent.field1.split('\n').length > 3 ? '...' : '');

  return (
    <div
      className="flex-shrink-0 w-48 h-auto min-h-[9rem] bg-card border border-border rounded-lg shadow-lg p-3 mx-3 flex flex-col items-start justify-start hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
      onClick={() => onClick(props)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(props);}}
      aria-label={`Select ${title} template`}
      data-ai-hint={dataAiHint.split(' ').slice(0, 2).join(' ')} 
    >
      <p className="text-xs font-semibold text-primary mb-1 truncate w-full">
        {title}
      </p>
      <div 
        className="w-full h-20 bg-muted/30 p-2 rounded-md overflow-hidden text-xs text-foreground/80 whitespace-pre-line"
        style={{ WebkitLineClamp: 4, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}
      >
        {previewText || "No preview available"}
      </div>
    </div>
  );
};

interface TemplateRowProps {
  templates: TemplateItemProps[];
  direction?: 'left' | 'right';
  speed?: string;
  onTemplateClick: (template: TemplateItemProps) => void;
}

const TemplateRow: FC<TemplateRowProps> = ({ templates, direction = 'left', speed = '30s', onTemplateClick }) => {
  const duplicatedTemplates = templates.length > 0 ? [...templates, ...templates, ...templates] : [];
  
  if (duplicatedTemplates.length === 0) return null;

  const animationClass = direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right';

  return (
    <div className="overflow-hidden w-full my-3">
      <div 
        className={`flex ${animationClass}`} 
        style={{ animationDuration: speed }}
      >
        {duplicatedTemplates.map((template, index) => (
          <TemplateItem key={`${template.id}-${index}`} {...template} onClick={onTemplateClick} />
        ))}
      </div>
    </div>
  );
};

const whatsAppTemplates: Omit<TemplateItemProps, 'onClick'>[] = [
  {
    id: 1,
    title: 'Product Launch (Marketing)',
    // imageUrl: 'https://placehold.co/160x90.png', // Retained for data structure, not displayed
    dataAiHint: 'Announce our new AI-powered chatbot solution with a 20% launch discount for the first 50 customers. Highlight key features: 24/7 availability and natural language understanding.',
    messageType: 'marketing',
    templateContent: {
      field1: "🚀 *Exciting News!* Our new AI Chatbot is HERE! 🤖\n\nTransform your customer service with 24/7 support & seamless conversations. Be among the *first 50* to get a *20% launch discount!*\n\n👉 Learn more & claim offer: [YourLink]",
      field2: "🎉 Introducing {{ProductName}}! 🎉\n\nSupercharge your support with our intelligent AI chatbot. Features:\n✅ 24/7 Availability\n✅ Natural Language Processing\n\n✨ Special Launch Offer: *20% OFF* for early birds! ✨\n\n🔗 Explore: [YourLink]",
      field3: "Get ready for the future of customer interaction! 💬 Our new *AI Chatbot* is now live.\n\nEnjoy round-the-clock assistance and smarter responses.\n\n*Limited Time Offer:* Secure your *20% discount* today!\n\n➡️ Discover: [YourLink]\n\n#AIChatbot #CustomerService #Innovation"
    }
  },
  {
    id: 2,
    title: 'OTP Verification (Auth)',
    // imageUrl: 'https://placehold.co/160x90.png',
    dataAiHint: 'Generate a WhatsApp OTP message for login. The code is 123456 and it expires in 5 minutes.',
    messageType: 'authentication',
    templateContent: {
      field1: "🔒 Your verification code is: ```123456```\n\nThis code is valid for 5 minutes. Please do not share it with anyone.\n\nThanks,\n{{YourCompanyName}} Team",
      field2: "*Authentication Required*\n\nYour One-Time Password (OTP) for logging in is: ```123456```\n\n_This OTP will expire in 5 minutes._",
      field3: "Hi there! Use code ```123456``` to complete your login. \n\nThis code expires shortly. For your security, never share this code. 🛡️"
    }
  },
  {
    id: 3,
    title: 'Appointment Reminder (Utility)',
    // imageUrl: 'https://placehold.co/160x90.png',
    dataAiHint: 'Remind a user about their dental check-up tomorrow at 10:00 AM with Dr. Smile.',
    messageType: 'utility',
    templateContent: {
      field1: "🗓️ *Appointment Reminder*\n\nHi {{UserName}},\nThis is a friendly reminder for your dental check-up with *Dr. Smile* tomorrow, {{Date}}, at *10:00 AM*.\n\nSee you soon!",
      field2: "Just a heads up! ⏰ Your appointment with *Dr. Smile* is scheduled for tomorrow at *10:00 AM*.\n\n📍 {{ClinicAddress}}\n📞 {{ClinicPhone}}\n\nNeed to reschedule? Reply to this message or call us.",
      field3: "Hi {{UserName}}! Don't forget your dental appointment:\n\n*Service:* Check-up\n*Provider:* Dr. Smile\n*Date:* Tomorrow, {{Date}}\n*Time:* 10:00 AM\n\nWe look forward to seeing you! 😊"
    }
  },
  {
    id: 4,
    title: 'Order Shipped (Utility)',
    // imageUrl: 'https://placehold.co/160x90.png',
    dataAiHint: 'Inform a customer their order #ABC12345 has shipped and provide tracking link XYZ.',
    messageType: 'utility',
    templateContent: {
      field1: "🚚 *Your Order #ABC12345 Has Shipped!* 🎉\n\nGreat news, {{UserName}}! Your items are on their way.\n\nTrack your package: [TrackingLinkXYZ]\n\nEstimated delivery: {{DeliveryDate}}",
      field2: "Good news! 📦 Your order *#ABC12345* is now en route!\n\nYou can follow its journey here: [TrackingLinkXYZ]\n\nExpected arrival: {{DeliveryDate}}. We hope you love your purchase!",
      field3: "Update on your order *#ABC12345*:\nIt's shipped! 🥳\n\n*Tracking:* [TrackingLinkXYZ]\n*Carrier:* {{CarrierName}}\n\nGet ready for your goodies!"
    }
  },
  {
    id: 5,
    title: 'Support Ticket Update (Service)',
    // imageUrl: 'https://placehold.co/160x90.png',
    dataAiHint: 'Provide an update on support ticket #TICKET101, stating the issue is being investigated.',
    messageType: 'service',
    templateContent: {
      field1: "ℹ️ *Update on Support Ticket #TICKET101*\n\nHi {{UserName}},\nOur team is currently investigating the issue you reported. We'll provide another update within 24 hours.\n\nThank you for your patience,\n{{YourCompanyName}} Support",
      field2: "Hello {{UserName}},\n\nThis is an update regarding your support ticket *#TICKET101*.\n\n*Status:* Under Investigation\n_We are actively working on it and will get back to you soon._\n\nThanks for reaching out!",
      field3: "Support Update for Ticket *#TICKET101*:\n\nDear {{UserName}},\nWe've received your query and our technical team is looking into it. We appreciate your patience and will update you as soon as we have more information.\n\nWarm regards,\nCustomer Care"
    }
  },
  {
    id: 6,
    title: 'Flash Sale (Marketing)',
    // imageUrl: 'https://placehold.co/160x90.png',
    dataAiHint: 'Announce a 24-hour flash sale with 30% off everything site-wide. Use urgency.',
    messageType: 'marketing',
    templateContent: {
      field1: "🚨 *FLASH SALE ALERT!* 🚨\n\nFor *24 HOURS ONLY*, get *30% OFF EVERYTHING* site-wide! 🛍️\n\nDon't miss out on incredible deals!\n\n👉 Shop Now: [YourLink]\n\n_Sale ends {{EndTime}}!_ ⏳",
      field2: "💥 *HUGE SAVINGS!* 💥\n\nOur 24-Hour Flash Sale is LIVE! Enjoy a whopping *30% DISCOUNT* on all products.\n\nTreat yourself or find the perfect gift! 🎁\n\n🔗 Link: [YourLink]\n\n*Hurry, time is running out!*",
      field3: "🔥 *IT'S HAPPENING!* 🔥\n\n*30% OFF EVERYTHING!* Yes, you read that right! Our exclusive 24-hour flash sale starts NOW.\n\nStock up on your favorites before it's too late!\n\n➡️ Go, Go, Go: [YourLink]\n\n#FlashSale #LimitedTimeOffer #Deals"
    }
  },
  {
    id: 7,
    title: 'Password Reset (Auth)',
    // imageUrl: 'https://placehold.co/160x90.png',
    dataAiHint: 'User requested a password reset. Provide a secure link to reset.',
    messageType: 'authentication',
    templateContent: {
      field1: "🔑 *Password Reset Request*\n\nHi {{UserName}},\nWe received a request to reset your password. Click the link below to set a new one:\n\n[PasswordResetLink]\n\n_If you didn't request this, please ignore this message._",
      field2: "Need to reset your password? No problem!\n\nUse this secure link to create a new password for your account: \n[PasswordResetLink]\n\nThis link will expire in {{ExpiryTime}}.\n\nFor your security, do not share this link.",
      field3: "*Security Alert: Password Reset*\n\nHello {{UserName}},\nTo reset your password, please follow this link: [PasswordResetLink]\n\nIf this wasn't you, your account is secure, and no action is needed. However, you may want to update your password as a precaution."
    }
  },
   {
    id: 8,
    title: 'Service Maintenance (Utility)',
    // imageUrl: 'https://placehold.co/160x90.png',
    dataAiHint: 'Inform users about upcoming scheduled maintenance for our app tonight from 2 AM to 4 AM. Mention service might be temporarily unavailable.',
    messageType: 'utility',
    templateContent: {
      field1: "⚙️ *Scheduled Maintenance Notice* ⚙️\n\nHi there,\nOur app will undergo scheduled maintenance *tonight from 2 AM to 4 AM {{TimeZone}}* to improve performance.\n\nServices may be temporarily unavailable during this time. We apologize for any inconvenience.",
      field2: "*Important Service Update*\n\nPlease be advised of a planned maintenance window for {{AppName}}:\n\n*Date:* Today/Tonight\n*Time:* 2:00 AM - 4:00 AM {{TimeZone}}\n\nDuring this period, access to the app might be intermittent. Thank you for your understanding.",
      field3: "🔧 Heads up! We're making {{AppName}} even better!\n\nScheduled maintenance is planned for *tonight, 2 AM - 4 AM {{TimeZone}}*.\n\nYou might experience temporary service disruptions. We'll be back up and running smoothly ASAP! 👍"
    }
  }
];

const displayTemplates = whatsAppTemplates.slice(0, 8);

interface TemplateGalleryProps {
  onTemplateClick: (template: TemplateItemProps) => void;
}

const TemplateGallery: FC<TemplateGalleryProps> = ({ onTemplateClick }) => {
  const typedDisplayTemplates = displayTemplates as TemplateItemProps[]; 

  const row1Templates = typedDisplayTemplates.slice(0, Math.min(7, typedDisplayTemplates.length));
  const row2Start = Math.min(1, typedDisplayTemplates.length -1); 
  const row2End = Math.min(8, typedDisplayTemplates.length);
  const row2Templates = typedDisplayTemplates.length > 1 ? typedDisplayTemplates.slice(row2Start, row2End) : (typedDisplayTemplates.length === 1 ? typedDisplayTemplates.slice(0,1) : []);
  const row3Templates = typedDisplayTemplates.slice(0, Math.min(7, typedDisplayTemplates.length));


  return (
    <div className="pt-6 border-t border-border mt-6">
      <h3 className="text-xl font-semibold text-center mb-6 text-primary">
        Explore WhatsApp FormFlow Templates
      </h3>
      {row1Templates.length > 0 && <TemplateRow templates={row1Templates} direction="left" speed="60s" onTemplateClick={onTemplateClick} />}
      {row2Templates.length > 0 && <TemplateRow templates={row2Templates} direction="right" speed="75s" onTemplateClick={onTemplateClick} />}
      {row3Templates.length > 0 && <TemplateRow templates={row3Templates} direction="left" speed="65s" onTemplateClick={onTemplateClick} />}
    </div>
  );
};

export default TemplateGallery;
