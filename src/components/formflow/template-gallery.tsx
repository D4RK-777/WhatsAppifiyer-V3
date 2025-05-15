
"use client";

import React, { FC, useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type MessageType = "marketing" | "authentication" | "utility" | "service";
type FilterCategory = "all" | MessageType;

export interface TemplateItemProps {
  id: number;
  title: string;
  dataAiHint: string; 
  messageType: MessageType;
  templateContent: { 
    field1?: string; 
    field2?: string; 
    field3?: string; 
  };
  onClick: (template: TemplateItemProps) => void;
}

const getTypeColorClasses = (type: TemplateItemProps['messageType']) => {
  switch (type) {
    case 'marketing':
      return 'border-green-400 hover:border-green-500 focus-visible:ring-green-500';
    case 'service':
      return 'border-yellow-400 hover:border-yellow-500 focus-visible:ring-yellow-500';
    case 'authentication':
      return 'border-orange-400 hover:border-orange-500 focus-visible:ring-orange-500';
    case 'utility':
      return 'border-blue-400 hover:border-blue-500 focus-visible:ring-blue-500';
    default:
      return 'border-border hover:border-primary focus-visible:ring-ring';
  }
};

const TemplateItem: FC<TemplateItemProps> = (props) => {
  const { title, dataAiHint, templateContent, onClick, messageType } = props;
  const previewText = templateContent.field1?.split('\n').slice(0, 3).join('\n') + (templateContent.field1 && templateContent.field1.split('\n').length > 3 ? '...' : '');
  const colorClasses = getTypeColorClasses(messageType);

  return (
    <div
      className={cn(
        "flex-shrink-0 w-48 h-auto min-h-[9rem] bg-card border-2 rounded-lg shadow-lg p-3 mx-3 flex flex-col items-start justify-start hover:shadow-xl transition-all duration-300 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        colorClasses
      )}
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
    dataAiHint: 'Remind a user about their dental check-up tomorrow at 10:00 AM with Dr. Smile. Include options to confirm or reschedule.',
    messageType: 'utility',
    templateContent: {
      field1: "🦷 *Appointment Tomorrow!* 🦷\n\nHi {{UserName}},\n\nThis is a reminder for your appointment with *Dr. Smile* tomorrow at *10:00 AM* for a dental check-up.\n\n📍 {{ClinicAddress}}\n\nTo confirm, reply with \"YES\". To reschedule, reply with \"NO\" or call us at {{ClinicPhone}}.",
      field2: "🗓️ *Friendly Reminder: Your Dental Check-up*\n\nHello {{UserName}},\n\nYour appointment with *Dr. Smile* is scheduled for tomorrow, {{Date}}, at *10:00 AM*.\n\nPlease reply *CONFIRM* to this message or call us at {{ClinicPhone}} if you need to reschedule.\n\nLooking forward to seeing your smile! 😊",
      field3: "✨ *Just a Quick Heads-Up!* ✨\n\nHi {{UserName}},\n\nDon't forget your dental appointment with *Dr. Smile*!\n*Date:* Tomorrow, {{Date}}\n*Time:* 10:00 AM\n*Service:* Dental Check-up\n\nIf you can make it, great! If not, please let us know by replying or calling {{ClinicPhone}}."
    }
  },
  {
    id: 4,
    title: 'Order Shipped (Utility)',
    dataAiHint: 'Inform a customer their order #ABC12345 has shipped and provide tracking link XYZ.',
    messageType: 'utility',
    templateContent: {
      field1: "🚚 *Your Order #ABC12345 Has Shipped!* 🎉\n\nGreat news, {{UserName}}!\n\nYour items are on their way.\n\nTrack your package: [TrackingLinkXYZ]\n\nEstimated delivery: {{DeliveryDate}}",
      field2: "📦 *On Its Way!* Your Order: #ABC12345\n\nHi {{UserName}},\n\nGood news! Your order is now en route!\n\nFollow its journey here: [TrackingLinkXYZ]\n\nExpected arrival: {{DeliveryDate}}. We hope you love your purchase!",
      field3: "Update on your order *#ABC12345*:\n\nIt's shipped! 🥳\n\n*Tracking:* [TrackingLinkXYZ]\n*Carrier:* {{CarrierName}}\n\nGet ready for your goodies, {{UserName}}!"
    }
  },
  {
    id: 5,
    title: 'Support Ticket Update (Service)',
    dataAiHint: 'Provide an update on support ticket #TICKET101, stating the issue is being investigated.',
    messageType: 'service',
    templateContent: {
      field1: "ℹ️ *Update on Support Ticket #TICKET101*\n\nHi {{UserName}},\n\nOur team is currently investigating the issue you reported. We'll provide another update within 24 hours.\n\nThank you for your patience,\n{{YourCompanyName}} Support",
      field2: "Hello {{UserName}},\n\nThis is an update regarding your support ticket *#TICKET101*.\n\n*Status:* Under Investigation\n_We are actively working on it and will get back to you soon._\n\nThanks for reaching out!",
      field3: "Support Update for Ticket *#TICKET101*:\n\nDear {{UserName}},\n\nWe've received your query and our technical team is looking into it. We appreciate your patience and will update you as soon as we have more information.\n\nWarm regards,\nCustomer Care"
    }
  },
  {
    id: 6,
    title: 'Flash Sale (Marketing)',
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
    dataAiHint: 'User requested a password reset. Provide a secure link to reset.',
    messageType: 'authentication',
    templateContent: {
      field1: "🔑 *Password Reset Request*\n\nHi {{UserName}},\n\nWe received a request to reset your password. Click the link below to set a new one:\n\n[PasswordResetLink]\n\n_If you didn't request this, please ignore this message._",
      field2: "Need to reset your password? No problem!\n\nHi {{UserName}},\n\nUse this secure link to create a new password for your account: \n[PasswordResetLink]\n\nThis link will expire in {{ExpiryTime}}.\n\nFor your security, do not share this link.",
      field3: "*Security Alert: Password Reset*\n\nHello {{UserName}},\n\nTo reset your password, please follow this link: [PasswordResetLink]\n\nIf this wasn't you, your account is secure, and no action is needed. However, you may want to update your password as a precaution."
    }
  },
   {
    id: 8,
    title: 'Service Maintenance (Utility)',
    dataAiHint: 'Inform users about upcoming scheduled maintenance for our app tonight from 2 AM to 4 AM. Mention service might be temporarily unavailable.',
    messageType: 'utility',
    templateContent: {
      field1: "⚙️ *Scheduled Maintenance Notice* ⚙️\n\nHi there,\n\nOur app will undergo scheduled maintenance *tonight from 2 AM to 4 AM {{TimeZone}}* to improve performance.\n\nServices may be temporarily unavailable during this time. We apologize for any inconvenience.",
      field2: "*Important Service Update*\n\nPlease be advised of a planned maintenance window for {{AppName}}:\n\n*Date:* Today/Tonight\n*Time:* 2:00 AM - 4:00 AM {{TimeZone}}\n\nDuring this period, access to the app might be intermittent. Thank you for your understanding.",
      field3: "🔧 Heads up! We're making {{AppName}} even better!\n\nScheduled maintenance is planned for *tonight, 2 AM - 4 AM {{TimeZone}}*.\n\nYou might experience temporary service disruptions. We'll be back up and running smoothly ASAP! 👍"
    }
  },
  {
    id: 9,
    title: 'Webinar Invitation (Marketing)',
    dataAiHint: 'Invite users to an upcoming webinar on AI in marketing. Mention date, time, and a key benefit.',
    messageType: 'marketing',
    templateContent: {
      field1: "🎓 *Free Webinar Alert!* 🎓\n\nDiscover how AI can revolutionize your marketing strategy! Join us on {{Date}} at {{Time}}.\n\nKey takeaway: Learn to automate 50% of your campaign tasks!\n\n➡️ Register here: [YourLink]\n\n_Limited spots available!_",
      field2: "📣 *Don't Miss Out!* 📣\n\nJoin our exclusive webinar: *AI for Marketers*\n🗓️ Date: {{Date}}\n⏰ Time: {{Time}}\n\nLearn practical tips to boost your ROI with AI.\n\n👉 Save your seat: [YourLink]\n\n#AI #Marketing #Webinar",
      field3: "Unlock the power of AI in your marketing! 🤖✨\n\nWe're hosting a *FREE live webinar* on {{Date}} at {{Time}} to show you how.\n\nWhat you'll learn:\n- AI-driven content creation\n- Personalized customer journeys\n- Predictive analytics\n\n🔗 Register now: [YourLink]\n\n_See you there!_"
    }
  },
  {
    id: 10,
    title: 'Contest/Giveaway (Marketing)',
    dataAiHint: 'Announce a new contest to win a {{Prize}}. Ask users to {{ActionToEnter}}, e.g., share a post or tag friends.',
    messageType: 'marketing',
    templateContent: {
      field1: "🏆 *CONTEST ALERT!* 🏆\n\nWant to win a {{Prize}}?\nIt's simple! Just {{ActionToEnter}} by {{EndDate}}.\n\nFull details & entry: [LinkToContest]\n\n_Good luck!_ 🍀",
      field2: "🎉 *GIVEAWAY TIME!* 🎉\n\nYou could be the lucky winner of a {{Prize}}!\nTo enter:\n1. {{Step1Action}}\n2. {{Step2Action}}\n\n🔗 Enter now: [LinkToContest]\n\nWinner announced on {{AnnouncementDate}}!",
      field3: "✨ *WIN BIG!* ✨\n\nWe're giving away a {{Prize}}!\n\nHow to enter:\n- {{ActionToEnter1}}\n- {{ActionToEnter2}}\n\nDon't miss out! Contest ends {{EndDate}}.\n\n➡️ [LinkToContest]\n\n#Contest #Giveaway #{{YourBrand}}"
    }
  },
  {
    id: 11,
    title: 'Feedback Request (Marketing)',
    dataAiHint: "Ask a customer for feedback on their recent purchase of {{ProductName}}. Offer a small incentive like 10% off.",
    messageType: 'marketing',
    templateContent: {
      field1: "Hey {{CustomerName}}! 👋\n\nHow are you liking your new {{ProductName}}?\nWe'd love to hear your thoughts! Your feedback helps us improve. 😊\n\nShare your review (it only takes a minute!): [FeedbackLink]\n\n_As a thank you, enjoy 10% off your next order!_",
      field2: "Hi {{CustomerName}},\n\nWe value your opinion! Could you spare a moment to rate your recent experience with {{ProductName}}?\n\nClick here to leave feedback: [FeedbackLink]\n\nYour insights are important to us! 🙏 For your time, here's a 10% discount code: ```THANKYOU10```",
      field3: "⭐ *Your Feedback Matters!* ⭐\n\nWe hope you're enjoying your {{ProductName}}!\n\nHelp us grow by sharing your experience: [FeedbackLink]\n\n🎁 _Get 10% off your next purchase for your time!_"
    }
  },
  {
    id: 12,
    title: 'Seasonal Sale (Marketing)',
    dataAiHint: 'Announce a Summer Sale with up to 50% off selected items. Create urgency.',
    messageType: 'marketing',
    templateContent: {
      field1: "☀️ *Summer Sale is ON!* ☀️\n\nGet up to *50% OFF* selected items! 🕶️👕\nStock up on your summer essentials now.\n\nShop the sale: [LinkToSale]\n\n_Offer ends {{Date}}! Don't let this chance melt away!_",
      field2: "🏖️ *Hello Summer Savings!* 🏖️\n\nDive into discounts! Up to *50% OFF* during our Summer Sale event.\n\nExplore deals: [LinkToSale]\n\n*Limited time only! Ends {{Date}}!*",
      field3: "😎 *Hot Deals for Hot Days!* 😎\n\nOur Summer Sale just dropped with up to *50% OFF*!\n\nFind your favorites: [LinkToSale]\n\n_Hurry, styles are selling fast & sale ends {{Date}}!_ 🛍️"
    }
  },
  {
    id: 13,
    title: 'Account Verification (Auth)',
    dataAiHint: 'Send an account verification link to a new user {{UserName}} to activate their {{AppName}} account.',
    messageType: 'authentication',
    templateContent: {
      field1: "✅ *Verify Your Account*\n\nWelcome to {{AppName}}! Please click the link below to verify your email and activate your account:\n\n[VerificationLink]\n\n_Link expires in 24 hours._",
      field2: "Almost there, {{UserName}}!\n\nJust one more step to get started with {{AppName}}.\n\nVerify your account: [VerificationLink]\n\nIf you didn't sign up, please ignore this message.",
      field3: "🔐 *Confirm Your Email for {{AppName}}*\n\nThanks for signing up, {{UserName}}!\n\nClick here to complete your registration:\n\n[VerificationLink]\n\n_This ensures your account is secure._"
    }
  },
  {
    id: 14,
    title: 'New Device Login Alert (Auth)',
    dataAiHint: 'Alert user {{UserName}} about a login to their {{AppName}} account from a new device/location {{DeviceLocation}} at {{Time}}. Provide options if it was not them.',
    messageType: 'authentication',
    templateContent: {
      field1: "🛡️ *Security Alert* 🛡️\n\nWe detected a new login to your {{AppName}} account from {{DeviceLocation}} at {{Time}}.\n\nIf this was you, no action is needed.\nIf not, please secure your account immediately: [SecureAccountLink]\n\nThanks, The {{AppName}} Team",
      field2: "*New Login Detected for {{AppName}}*\n\nWas this you, {{UserName}}? A login just occurred from:\nDevice: {{DeviceType}}\nLocation: {{LocationApprox}}\n\nNot you? [LinkToReportSuspiciousActivity]\nYes, this was me.",
      field3: "Hi {{UserName}},\n\nFor your security, we're notifying you of a login from a new device/location for your {{AppName}} account.\n\nDate: {{Date}}\nTime: {{Time}}\nApprox. Location: {{Location}}\n\nIf this wasn't you, please change your password and review your account activity here: [SecuritySettingsLink]"
    }
  },
  {
    id: 15,
    title: 'Order Confirmation (Utility)',
    dataAiHint: "Confirm customer {{CustomerName}}'s order #{{OrderID}} for {{TotalAmount}}. Mention expected delivery window {{DeliveryWindow}}.",
    messageType: 'utility',
    templateContent: {
      field1: "✅ *Order Confirmed! #{{OrderID}}* ✅\n\nThanks for your order, {{CustomerName}}!\n\nYour order for {{TotalAmount}} has been successfully placed.\n\nWe'll notify you when it ships. Estimated delivery: {{DeliveryWindow}}.\n\nTrack progress: [OrderTrackingLink]",
      field2: "🎉 *Your {{AppName}} Order #{{OrderID}} is Confirmed!* 🎉\n\nHi {{CustomerName}},\n\nWe've received your order totaling {{TotalAmount}}.\n\nExpected delivery: {{DeliveryWindow}}.\nYou can view your order details here: [OrderDetailsLink]\n\nThanks for shopping with us!",
      field3: "Order #{{OrderID}} received!\n\nHi {{CustomerName}},\n\nAmount: {{TotalAmount}}\nItems: {{ShortListOfItemsOrItemCount}}\n\nWe're preparing your order for shipment. You'll get another update soon!\n\n_Questions? Contact us at {{SupportEmailOrPhone}}._"
    }
  },
  {
    id: 16,
    title: 'Subscription Renewal (Utility)',
    dataAiHint: "Remind user {{UserName}} their {{SubscriptionName}} subscription is renewing on {{RenewalDate}} for {{RenewalAmount}}.",
    messageType: 'utility',
    templateContent: {
      field1: "🔔 *Subscription Renewal Reminder* 🔔\n\nHi {{UserName}},\n\nYour {{SubscriptionName}} subscription is due for renewal on *{{RenewalDate}}* for {{RenewalAmount}}.\n\nNo action is needed if you wish to continue. To manage your subscription: [SubscriptionManagementLink]\n\nThanks for being a valued subscriber!",
      field2: "Heads up, {{UserName}}!\n\nYour {{SubscriptionName}} plan will automatically renew on {{RenewalDate}}.\n\nAmount: {{RenewalAmount}}\n\nManage your subscription settings here: [Link]\n\n_Stay with us to keep enjoying {{KeyBenefit}}!_",
      field3: "🗓️ *Friendly Renewal Notice*\n\nHi {{UserName}},\n\nYour {{SubscriptionName}} subscription is set to renew on {{RenewalDate}}.\n\nTo ensure uninterrupted access to {{Feature}}, no action is required. Your payment method will be charged {{RenewalAmount}}.\n\nUpdate payment or cancel: [LinkToAccount]"
    }
  },
  {
    id: 17,
    title: 'Support Ticket Received (Service)',
    dataAiHint: "Confirm receipt of {{UserName}}'s support query, provide ticket ID {{TicketID}}, and set {{ResponseTimeEstimate}} for response.",
    messageType: 'service',
    templateContent: {
      field1: "✅ *Support Ticket Received: #{{TicketID}}*\n\nHi {{UserName}},\n\nThanks for contacting us! We've received your support request (Ticket ID: {{TicketID}}).\n\nOur team will get back to you within {{ResponseTimeEstimate_e.g.,_24_business_hours}}.\n\nRegards,\nThe {{AppName}} Support Team",
      field2: "Got it! 👍 Your support query has been logged as ticket *#{{TicketID}}*.\n\nHi {{UserName}},\n\nWe're on it! Expect a response from our support specialists within {{ResponseTimeEstimate}}.\n\nIn the meantime, you might find our FAQ helpful: [FAQLink]",
      field3: "Hello {{UserName}},\n\nThis confirms we've received your inquiry (Ticket: *{{TicketID}}*).\n\nOur support ninjas are reviewing it and will reply as soon as possible, typically within {{ResponseTimeEstimate}}.\n\nThank you for your patience!"
    }
  },
  {
    id: 18,
    title: 'Post-Support Feedback (Service)',
    dataAiHint: "Ask {{UserName}} for feedback on recently resolved support ticket #{{TicketID}}.",
    messageType: 'service',
    templateContent: {
      field1: "Hi {{UserName}},\n\nWe see your support ticket #{{TicketID}} was recently resolved. We'd love to hear about your experience!\n\nCould you take a moment to rate our support? [FeedbackLink]\n\nYour feedback helps us improve! 🙏",
      field2: "Hope we helped! 😊\n\nHi {{UserName}},\n\nNow that your issue (Ticket #{{TicketID}}) is resolved, would you mind sharing your feedback on our service?\n\nIt's quick: [SurveyLink]\n\nThanks for helping us get better!",
      field3: "🌟 *How did we do?* 🌟\n\nHi {{UserName}},\n\nRegarding your recent support interaction for ticket #{{TicketID}}, we'd appreciate your honest feedback.\n\nClick here to share your thoughts: [FeedbackFormLink]\n\n_Your input is invaluable!_"
    }
  },
  {
    id: 19,
    title: 'New User Welcome (Service)',
    dataAiHint: "Welcome new user {{UserName}} to {{AppName}}. Highlight a key feature {{KeyFeatureDescription}} or next step {{ActionableNextStep}}.",
    messageType: 'service',
    templateContent: {
      field1: "🎉 *Welcome to {{AppName}}, {{UserName}}!* 🎉\n\nWe're thrilled to have you on board! Get started by exploring {{KeyFeatureDescription_e.g.,_our_dashboard}} here: [LinkToFeatureOrDashboard]\n\nQuestions? Check out our guide: [GettingStartedGuideLink]",
      field2: "Hey {{UserName}}! 👋\n\nWelcome to the {{AppName}} family!\n\nReady to dive in? Your first step could be to {{ActionableNextStep_e.g.,_set_up_your_profile}}.\n\nLet us know if you need anything!\n\n_The {{AppName}} Team_",
      field3: "Welcome aboard, {{UserName}}! 🚀\n\nSuper excited you've joined {{AppName}}!\n\nHere's a quick tip to get you started: {{QuickTip}}.\n\nExplore more features: [AppFeaturesLink]\n\nHappy {{AppActivity_e.g.,_messaging}}!"
    }
  }
];

interface TemplateGalleryProps {
  onTemplateClick: (template: TemplateItemProps) => void;
}

const TemplateGallery: FC<TemplateGalleryProps> = ({ onTemplateClick }) => {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");

  const allFullTemplates = whatsAppTemplates as TemplateItemProps[];

  const filteredTemplates = activeFilter === "all" 
    ? allFullTemplates 
    : allFullTemplates.filter(template => template.messageType === activeFilter);
  
  let displayTemplates: TemplateItemProps[] = [];
  if (filteredTemplates.length > 0) {
    // Ensure we have enough templates for 3 rows if possible, by repeating the filtered set.
    // Max 8 items per row visually due to duplication in TemplateRow, target 24 total visual items.
    const base = filteredTemplates; 
    while(displayTemplates.length < 24 && base.length > 0) { 
        displayTemplates = displayTemplates.concat(base);
    }
    // If still not enough after full repetitions, ensure at least one full set or triple the initial if small.
    if (displayTemplates.length === 0 && base.length > 0) displayTemplates = [...base, ...base, ...base]; 
    else if (displayTemplates.length < 8 && displayTemplates.length > 0) { 
        const currentDisplay = [...displayTemplates];
        while(displayTemplates.length < Math.max(8, currentDisplay.length * 2)) { // Ensure at least 8 visual items or double for small sets
            displayTemplates = displayTemplates.concat(currentDisplay);
        }
    }
    displayTemplates = displayTemplates.slice(0,24); // Cap at 24 total visual items for the carousels
  }

  // Distribute templates among rows, aiming for roughly equal distribution if many templates.
  // The TemplateRow component internally duplicates for scrolling, so we feed it unique items per row.
  const itemsPerRow = Math.max(1, Math.ceil(displayTemplates.length / 3));
  const row1Templates = displayTemplates.slice(0, itemsPerRow);
  const row2Templates = displayTemplates.slice(itemsPerRow, itemsPerRow * 2);
  const row3Templates = displayTemplates.slice(itemsPerRow * 2, displayTemplates.length);


  const filterCategories: { label: string; value: FilterCategory }[] = [
    { label: "All", value: "all" },
    { label: "Marketing", value: "marketing" },
    { label: "Authentication", value: "authentication" },
    { label: "Utility", value: "utility" },
    { label: "Service", value: "service" },
  ];

  return (
    <div className="pt-6 border-t border-border mt-6">
      <h3 className="text-xl font-semibold text-center mb-4 text-primary">
        Explore WhatsApp Templates
      </h3>
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {filterCategories.map(category => (
          <Button
            key={category.value}
            type="button" // Prevent form submission behavior
            variant={activeFilter === category.value ? "default" : "outline"}
            onClick={() => setActiveFilter(category.value)}
            className="rounded-full px-4 py-1.5 text-sm"
          >
            {category.label}
          </Button>
        ))}
      </div>
      {row1Templates.length > 0 && <TemplateRow templates={row1Templates} direction="left" speed="60s" onTemplateClick={onTemplateClick} />}
      {row2Templates.length > 0 && <TemplateRow templates={row2Templates} direction="right" speed="75s" onTemplateClick={onTemplateClick} />}
      {row3Templates.length > 0 && <TemplateRow templates={row3Templates} direction="left" speed="65s" onTemplateClick={onTemplateClick} />}
       {filteredTemplates.length === 0 && activeFilter !== "all" && (
        <p className="text-center text-muted-foreground mt-4">No templates found for "{activeFilter}" category.</p>
      )}
    </div>
  );
};

export default TemplateGallery;
