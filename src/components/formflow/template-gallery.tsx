
"use client";

import React, { FC, useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type MessageType = "marketing" | "authentication" | "utility" | "service";
type FilterCategory = "all" | MessageType;

export interface TemplateItemProps {
  id: number;
  title: string; // This will now be just the use case, e.g., "Product Launch"
  dataAiHint: string;
  messageType: MessageType;
  templateContent: {
    field1?: string;
    field2?: string;
    field3?: string;
  };
  onClick: (template: TemplateItemProps) => void;
}

interface TypeColorStyle {
  borderClasses: string;
  textHeaderClass: string;
  cardBackgroundClass: string;
  categoryLabelClass: string;
}

// WhatsApp Color Palette
const whatsappColors = {
  mainActiveGreen: '#128C7E',
  hoverMainActiveGreen: '#0F7A6E', // Slightly darker for hover on active button

  brightGreenMarketing: '#25D366',
  textOnBrightGreenMarketing: 'text-green-950', // For gradient text if ever re-introduced
  darkTextOnGreenGradientMarketing: 'text-green-50', // For gradient text on dark if ever re-introduced

  lightBlueAuthUtility: '#34B7F1',
  textOnLightBlueAuthUtility: 'text-blue-950',
  darkTextOnBlueGradientAuthUtility: 'text-blue-50',

  lightBeigeCardBgLight: '#ECE5DD', // Applied
  darkCardBg: '#131C21', // Applied (was slate-800, changed to custom)

  darkTealHeaderLight: '#075E54', // Applied
  darkHeaderTextDark: '#9ADBC4', // Applied (example, could be lighter green)

  lightGreenPreviewBg: '#DCF8C6', // Applied for inner message box

  neutralServiceGrey: '#737373', // Tailwind neutral-500 equivalent for consistency
  lightServiceGreyFrom: '#d4d4d8', // Tailwind zinc-300 for gradient start
  darkServiceGrey: '#a1a1aa', // Tailwind zinc-400 for dark mode service
  darkLightServiceGreyFrom: '#71717a', // Tailwind zinc-500 for dark gradient start
  textOnNeutralServiceGrey: 'text-slate-900',
  darkTextOnNeutralServiceGrey: 'text-slate-100'
};

interface TypeSpecificInitialColors {
  initialBorderColor: string;
  initialTextColor: string;
  initialDarkTextColor: string;
}

// Returns initial border and text colors for INACTIVE category-specific buttons
const getTypeSpecificInitialColors = (type: MessageType): TypeSpecificInitialColors => {
  switch (type) {
    case 'marketing':
      return {
        initialBorderColor: whatsappColors.brightGreenMarketing,
        initialTextColor: whatsappColors.brightGreenMarketing,
        initialDarkTextColor: whatsappColors.brightGreenMarketing, // Assuming this green is visible enough on dark
      };
    case 'service':
      return {
        initialBorderColor: whatsappColors.neutralServiceGrey,
        initialTextColor: whatsappColors.neutralServiceGrey,
        initialDarkTextColor: whatsappColors.darkServiceGrey,
      };
    case 'authentication':
    case 'utility':
      return {
        initialBorderColor: whatsappColors.lightBlueAuthUtility,
        initialTextColor: whatsappColors.lightBlueAuthUtility,
        initialDarkTextColor: whatsappColors.lightBlueAuthUtility, // Assuming this blue is visible enough on dark
      };
  }
};


const getTypeColorStyles = (type: MessageType): TypeColorStyle => {
  switch (type) {
    case 'marketing':
      return {
        borderClasses: `border-[${whatsappColors.brightGreenMarketing}] hover:border-[${whatsappColors.brightGreenMarketing}] focus-visible:ring-[${whatsappColors.brightGreenMarketing}]`,
        textHeaderClass: `text-[${whatsappColors.darkTealHeaderLight}] dark:text-[${whatsappColors.darkHeaderTextDark}]`,
        cardBackgroundClass: `bg-[${whatsappColors.lightBeigeCardBgLight}] dark:bg-[${whatsappColors.darkCardBg}]`,
        categoryLabelClass: `text-[${whatsappColors.brightGreenMarketing}]`,
      };
    case 'service':
      return {
        borderClasses: `border-[${whatsappColors.neutralServiceGrey}] dark:border-[${whatsappColors.darkServiceGrey}] hover:border-[${whatsappColors.darkServiceGrey}] dark:hover:border-[${whatsappColors.neutralServiceGrey}] focus-visible:ring-[${whatsappColors.darkServiceGrey}]`,
        textHeaderClass: `text-[${whatsappColors.darkTealHeaderLight}] dark:text-[${whatsappColors.darkHeaderTextDark}]`,
        cardBackgroundClass: `bg-[${whatsappColors.lightBeigeCardBgLight}] dark:bg-[${whatsappColors.darkCardBg}]`,
        categoryLabelClass: `text-[${whatsappColors.neutralServiceGrey}] dark:text-[${whatsappColors.darkServiceGrey}]`,
      };
    case 'authentication':
    case 'utility':
      return {
        borderClasses: `border-[${whatsappColors.lightBlueAuthUtility}] hover:border-[${whatsappColors.lightBlueAuthUtility}] focus-visible:ring-[${whatsappColors.lightBlueAuthUtility}]`,
        textHeaderClass: `text-[${whatsappColors.darkTealHeaderLight}] dark:text-[${whatsappColors.darkHeaderTextDark}]`,
        cardBackgroundClass: `bg-[${whatsappColors.lightBeigeCardBgLight}] dark:bg-[${whatsappColors.darkCardBg}]`,
        categoryLabelClass: `text-[${whatsappColors.lightBlueAuthUtility}]`,
      };
    default:
      return { // Should not be hit if all types are covered
        borderClasses: 'border-border hover:border-primary focus-visible:ring-ring',
        textHeaderClass: `text-[${whatsappColors.darkTealHeaderLight}] dark:text-[${whatsappColors.darkHeaderTextDark}]`,
        cardBackgroundClass: `bg-[${whatsappColors.lightBeigeCardBgLight}] dark:bg-[${whatsappColors.darkCardBg}]`,
        categoryLabelClass: 'text-foreground',
      };
  }
};

const TemplateItem: FC<TemplateItemProps> = (props) => {
  const { title, dataAiHint, templateContent, onClick, messageType } = props;
  const previewText = templateContent.field1 || "";
  const { borderClasses, textHeaderClass, cardBackgroundClass, categoryLabelClass } = getTypeColorStyles(messageType);

  return (
    <div
      className={cn(
        "flex-shrink-0 w-48 h-auto min-h-[10rem] border-2 rounded-lg shadow-md p-2 mx-3 flex flex-col items-start justify-start hover:shadow-xl transition-all duration-300 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        borderClasses, // Uses border color from messageType
        cardBackgroundClass // Uses background color from messageType
      )}
      onClick={() => onClick(props)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(props);}}
      aria-label={`Select ${title} template`}
      data-ai-hint={dataAiHint.split(' ').slice(0, 2).join(' ')}
    >
      <p className={cn("text-[0.6rem] font-bold uppercase tracking-wider mb-0.5", categoryLabelClass)}>
        {messageType}
      </p>
      <p className={cn("text-xs font-semibold mb-1 truncate w-full", textHeaderClass)}>
        {title}
      </p>
      <div
        className="w-full h-20 bg-[#DCF8C6] p-2 rounded-md overflow-hidden text-xs text-zinc-800 whitespace-pre-line" // WhatsApp outgoing bubble green
        style={{ WebkitLineClamp: 5, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}
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
    title: 'Product Launch', // Title is now just the use case
    dataAiHint: 'Announce our new AI-powered chatbot solution with a 20% launch discount for the first 50 customers. Highlight key features: 24/7 availability and natural language understanding.',
    messageType: 'marketing',
    templateContent: {
      field1: "*Namaste!*\n\n🚀 *Exciting News!* Our new AI Chatbot is HERE! 🤖\n\nTransform your customer service with 24/7 support & seamless conversations. Be among the *first 50* to get a *20% launch discount!*\n\n👉 Learn more & claim offer: [YourLink]",
      field2: "*Hello!*\n\n🎉 Introducing {{ProductName}}! 🎉\n\nSupercharge your support with our intelligent AI chatbot. Features:\n✅ 24/7 Availability\n✅ Natural Language Processing\n\n✨ Special Launch Offer: *20% OFF* for early birds! ✨\n\n🔗 Explore: [YourLink]",
      field3: "*Greetings!*\n\nGet ready for the future of customer interaction! 💬 Our new *AI Chatbot* is now live.\n\nEnjoy round-the-clock assistance and smarter responses.\n\n*Limited Time Offer:* Secure your *20% discount* today!\n\n➡️ Discover: [YourLink]\n\n#AIChatbot #CustomerService #Innovation"
    }
  },
  {
    id: 2,
    title: 'OTP Verification',
    dataAiHint: 'Generate a WhatsApp OTP message for login. The code is 123456 and it expires in 5 minutes.',
    messageType: 'authentication',
    templateContent: {
      field1: "Hi {{UserName}},\n\nYour verification code is: ```123456```\n\nThis code is valid for 5 minutes. Please do not share it with anyone.\n\nThanks,\n{{YourCompanyName}} Team",
      field2: "Hi {{UserName}},\n\n*Authentication Required*\n\nYour One-Time Password (OTP) for logging in is: ```123456```\n\n_This OTP will expire in 5 minutes._",
      field3: "Hi {{UserName}},\n\nUse code ```123456``` to complete your login. \n\nThis code expires shortly. For your security, never share this code. 🛡️"
    }
  },
  {
    id: 3,
    title: 'Appointment Reminder',
    dataAiHint: 'Remind a user about their dental check-up tomorrow at 10:00 AM with Dr. Smile. Include options to confirm or reschedule.',
    messageType: 'utility',
    templateContent: {
      field1: "Hi {{UserName}},\n\n🦷 *Appointment Tomorrow!* 🦷\n\nThis is a reminder for your appointment with *Dr. Smile* tomorrow at *10:00 AM* for a dental check-up.\n\n📍 {{ClinicAddress}}\n\nTo confirm, reply with \"YES\". To reschedule, reply with \"NO\" or call us at {{ClinicPhone}}.",
      field2: "Hi {{UserName}},\n\n🗓️ *Friendly Reminder: Your Dental Check-up*\n\nYour appointment with *Dr. Smile* is scheduled for tomorrow, {{Date}}, at *10:00 AM*.\n\nPlease reply *CONFIRM* to this message or call us at {{ClinicPhone}} if you need to reschedule.\n\nLooking forward to seeing your smile! 😊",
      field3: "Hi {{UserName}},\n\n✨ *Just a Quick Heads-Up!* ✨\n\nDon't forget your dental appointment with *Dr. Smile*!\n*Date:* Tomorrow, {{Date}}\n*Time:* 10:00 AM\n*Service:* Dental Check-up\n\nIf you can make it, great! If not, please let us know by replying or calling {{ClinicPhone}}."
    }
  },
  {
    id: 4,
    title: 'Order Shipped',
    dataAiHint: 'Inform a customer their order #ABC12345 has shipped and provide tracking link XYZ.',
    messageType: 'utility',
    templateContent: {
      field1: "Hi {{UserName}},\n\n🚚 *Your Order #ABC12345 Has Shipped!* 🎉\n\nGreat news! Your items are on their way.\n\nTrack your package: [TrackingLinkXYZ]\n\nEstimated delivery: {{DeliveryDate}}",
      field2: "Hi {{UserName}},\n\n📦 *On Its Way!* Your Order: #ABC12345\n\nGood news! Your order is now en route!\n\nFollow its journey here: [TrackingLinkXYZ]\n\nExpected arrival: {{DeliveryDate}}. We hope you love your purchase!",
      field3: "Hi {{UserName}},\n\nUpdate on your order *#ABC12345*:\n\nIt's shipped! 🥳\n\n*Tracking:* [TrackingLinkXYZ]\n*Carrier:* {{CarrierName}}\n\nGet ready for your goodies!"
    }
  },
  {
    id: 5,
    title: 'Support Ticket Update',
    dataAiHint: 'Provide an update on support ticket #TICKET101, stating the issue is being investigated.',
    messageType: 'service',
    templateContent: {
      field1: "Hi {{UserName}},\n\nℹ️ *Update on Support Ticket #TICKET101*\n\nOur team is currently investigating the issue you reported. We'll provide another update within 24 hours.\n\nThank you for your patience,\n{{YourCompanyName}} Support",
      field2: "Hi {{UserName}},\n\nThis is an update regarding your support ticket *#TICKET101*.\n\n*Status:* Under Investigation\n_We are actively working on it and will get back to you soon._\n\nThanks for reaching out!",
      field3: "Hi {{UserName}},\n\nSupport Update for Ticket *#TICKET101*:\n\nWe've received your query and our technical team is looking into it. We appreciate your patience and will update you as soon as we have more information.\n\nWarm regards,\nCustomer Care"
    }
  },
  {
    id: 6,
    title: 'Flash Sale',
    dataAiHint: 'Announce a 24-hour flash sale with 30% off everything site-wide. Use urgency.',
    messageType: 'marketing',
    templateContent: {
      field1: "*Hi there!*\n\n🚨 *FLASH SALE ALERT!* 🚨\n\nFor *24 HOURS ONLY*, get *30% OFF EVERYTHING* site-wide! 🛍️\n\nDon't miss out on incredible deals!\n\n👉 Shop Now: [YourLink]\n\n_Sale ends {{EndTime}}!_ ⏳",
      field2: "*Hey!*\n\n💥 *HUGE SAVINGS!* 💥\n\nOur 24-Hour Flash Sale is LIVE! Enjoy a whopping *30% DISCOUNT* on all products.\n\nTreat yourself or find the perfect gift! 🎁\n\n🔗 Link: [YourLink]\n\n*Hurry, time is running out!*",
      field3: "*Hello!*\n\n🔥 *IT'S HAPPENING!* 🔥\n\n*30% OFF EVERYTHING!* Yes, you read that right! Our exclusive 24-hour flash sale starts NOW.\n\nStock up on your favorites before it's too late!\n\n➡️ Go, Go, Go: [YourLink]\n\n#FlashSale #LimitedTimeOffer #Deals"
    }
  },
  {
    id: 7,
    title: 'Password Reset',
    dataAiHint: 'User requested a password reset. Provide a secure link to reset.',
    messageType: 'authentication',
    templateContent: {
      field1: "Hi {{UserName}},\n\n🔑 *Password Reset Request*\n\nWe received a request to reset your password. Click the link below to set a new one:\n\n[PasswordResetLink]\n\n_If you didn't request this, please ignore this message._",
      field2: "Hi {{UserName}},\n\nNeed to reset your password? No problem!\n\nUse this secure link to create a new password for your account: \n[PasswordResetLink]\n\nThis link will expire in {{ExpiryTime}}.\n\nFor your security, do not share this link.",
      field3: "Hi {{UserName}},\n\n*Security Alert: Password Reset*\n\nTo reset your password, please follow this link: [PasswordResetLink]\n\nIf this wasn't you, your account is secure, and no action is needed. However, you may want to update your password as a precaution."
    }
  },
   {
    id: 8,
    title: 'Service Maintenance',
    dataAiHint: 'Inform users about upcoming scheduled maintenance for our app tonight from 2 AM to 4 AM. Mention service might be temporarily unavailable.',
    messageType: 'utility',
    templateContent: {
      field1: "Hi there,\n\n⚙️ *Scheduled Maintenance Notice* ⚙️\n\nOur app will undergo scheduled maintenance *tonight from 2 AM to 4 AM {{TimeZone}}* to improve performance.\n\nServices may be temporarily unavailable during this time. We apologize for any inconvenience.",
      field2: "Hi there,\n\n*Important Service Update*\n\nPlease be advised of a planned maintenance window for {{AppName}}:\n\n*Date:* Today/Tonight\n*Time:* 2:00 AM - 4:00 AM {{TimeZone}}\n\nDuring this period, access to the app might be intermittent. Thank you for your understanding.",
      field3: "Hi there,\n\n🔧 Heads up! We're making {{AppName}} even better!\n\nScheduled maintenance is planned for *tonight, 2 AM - 4 AM {{TimeZone}}*.\n\nYou might experience temporary service disruptions. We'll be back up and running smoothly ASAP! 👍"
    }
  },
  {
    id: 9,
    title: 'Webinar Invitation',
    dataAiHint: 'Invite users to an upcoming webinar on AI in marketing. Mention date, time, and a key benefit.',
    messageType: 'marketing',
    templateContent: {
      field1: "Hi {{UserName}},\n\n🎓 *Free Webinar Alert!* 🎓\n\nDiscover how AI can revolutionize your marketing strategy! Join us on {{Date}} at {{Time}}.\n\nKey takeaway: Learn to automate 50% of your campaign tasks!\n\n➡️ Register here: [YourLink]\n\n_Limited spots available!_",
      field2: "Hi {{UserName}},\n\n📣 *Don't Miss Out!* 📣\n\nJoin our exclusive webinar: *AI for Marketers*\n🗓️ Date: {{Date}}\n⏰ Time: {{Time}}\n\nLearn practical tips to boost your ROI with AI.\n\n👉 Save your seat: [YourLink]\n\n#AI #Marketing #Webinar",
      field3: "Hi {{UserName}},\n\nUnlock the power of AI in your marketing! 🤖✨\n\nWe're hosting a *FREE live webinar* on {{Date}} at {{Time}} to show you how.\n\nWhat you'll learn:\n- AI-driven content creation\n- Personalized customer journeys\n- Predictive analytics\n\n🔗 Register now: [YourLink]\n\n_See you there!_"
    }
  },
  {
    id: 10,
    title: 'Contest/Giveaway',
    dataAiHint: 'Announce a new contest to win a {{Prize}}. Ask users to {{ActionToEnter}}, e.g., share a post or tag friends.',
    messageType: 'marketing',
    templateContent: {
      field1: "Hi {{UserName}},\n\n🏆 *CONTEST ALERT!* 🏆\n\nWant to win a {{Prize}}?\nIt's simple! Just {{ActionToEnter}} by {{EndDate}}.\n\nFull details & entry: [LinkToContest]\n\n_Good luck!_ 🍀",
      field2: "Hi {{UserName}},\n\n🎉 *GIVEAWAY TIME!* 🎉\n\nYou could be the lucky winner of a {{Prize}}!\nTo enter:\n1. {{Step1Action}}\n2. {{Step2Action}}\n\n🔗 Enter now: [LinkToContest]\n\nWinner announced on {{AnnouncementDate}}!",
      field3: "Hi {{UserName}},\n\n✨ *WIN BIG!* ✨\n\nWe're giving away a {{Prize}}!\n\nHow to enter:\n- {{ActionToEnter1}}\n- {{ActionToEnter2}}\n\nDon't miss out! Contest ends {{EndDate}}.\n\n➡️ [LinkToContest]\n\n#Contest #Giveaway #{{YourBrand}}"
    }
  },
  {
    id: 11,
    title: 'Feedback Request',
    dataAiHint: "Ask a customer for feedback on their recent purchase of {{ProductName}}. Offer a small incentive like 10% off.",
    messageType: 'marketing', // Can also be 'service' depending on context
    templateContent: {
      field1: "Hi {{CustomerName}}! 👋\n\nHow are you liking your new {{ProductName}}?\nWe'd love to hear your thoughts! Your feedback helps us improve. 😊\n\nShare your review (it only takes a minute!): [FeedbackLink]\n\n_As a thank you, enjoy 10% off your next order!_",
      field2: "Hi {{CustomerName}},\n\nWe value your opinion! Could you spare a moment to rate your recent experience with {{ProductName}}?\n\nClick here to leave feedback: [FeedbackLink]\n\nYour insights are important to us! 🙏 For your time, here's a 10% discount code: ```THANKYOU10```",
      field3: "Hi {{CustomerName}},\n\n⭐ *Your Feedback Matters!* ⭐\n\nWe hope you're enjoying your {{ProductName}}!\n\nHelp us grow by sharing your experience: [FeedbackLink]\n\n🎁 _Get 10% off your next purchase for your time!_"
    }
  },
  {
    id: 12,
    title: 'Seasonal Sale',
    dataAiHint: 'Announce a Summer Sale with up to 50% off selected items. Create urgency.',
    messageType: 'marketing',
    templateContent: {
      field1: "Hi {{UserName}},\n\n☀️ *Summer Sale is ON!* ☀️\n\nGet up to *50% OFF* selected items! 🕶️👕\nStock up on your summer essentials now.\n\nShop the sale: [LinkToSale]\n\n_Offer ends {{Date}}! Don't let this chance melt away!_",
      field2: "Hi {{UserName}},\n\n🏖️ *Hello Summer Savings!* 🏖️\n\nDive into discounts! Up to *50% OFF* during our Summer Sale event.\n\nExplore deals: [LinkToSale]\n\n*Limited time only! Ends {{Date}}!*",
      field3: "Hi {{UserName}},\n\n😎 *Hot Deals for Hot Days!* 😎\n\nOur Summer Sale just dropped with up to *50% OFF*!\n\nFind your favorites: [LinkToSale]\n\n_Hurry, styles are selling fast & sale ends {{Date}}!_ 🛍️"
    }
  },
  {
    id: 13,
    title: 'Account Verification',
    dataAiHint: 'Send an account verification link to a new user {{UserName}} to activate their {{AppName}} account.',
    messageType: 'authentication',
    templateContent: {
      field1: "Hi {{UserName}},\n\n✅ *Verify Your Account*\n\nWelcome to {{AppName}}! Please click the link below to verify your email and activate your account:\n\n[VerificationLink]\n\n_Link expires in 24 hours._",
      field2: "Hi {{UserName}},\n\nAlmost there!\n\nJust one more step to get started with {{AppName}}.\n\nVerify your account: [VerificationLink]\n\nIf you didn't sign up, please ignore this message.",
      field3: "Hi {{UserName}},\n\n🔐 *Confirm Your Email for {{AppName}}*\n\nThanks for signing up!\n\nClick here to complete your registration:\n\n[VerificationLink]\n\n_This ensures your account is secure._"
    }
  },
  {
    id: 14,
    title: 'New Device Login Alert',
    dataAiHint: 'Alert user {{UserName}} about a login to their {{AppName}} account from a new device/location {{DeviceLocation}} at {{Time}}. Provide options if it was not them.',
    messageType: 'authentication',
    templateContent: {
      field1: "Hi {{UserName}},\n\n🛡️ *Security Alert* 🛡️\n\nWe detected a new login to your {{AppName}} account from {{DeviceLocation}} at {{Time}}.\n\nIf this was you, no action is needed.\nIf not, please secure your account immediately: [SecureAccountLink]\n\nThanks, The {{AppName}} Team",
      field2: "Hi {{UserName}},\n\n*New Login Detected for {{AppName}}*\n\nWas this you? A login just occurred from:\nDevice: {{DeviceType}}\nLocation: {{LocationApprox}}\n\nNot you? [LinkToReportSuspiciousActivity]\nYes, this was me.",
      field3: "Hi {{UserName}},\n\nFor your security, we're notifying you of a login from a new device/location for your {{AppName}} account.\n\nDate: {{Date}}\nTime: {{Time}}\nApprox. Location: {{Location}}\n\nIf this wasn't you, please change your password and review your account activity here: [SecuritySettingsLink]"
    }
  },
  {
    id: 15,
    title: 'Order Confirmation',
    dataAiHint: "Confirm customer {{CustomerName}}'s order #{{OrderID}} for {{TotalAmount}}. Mention expected delivery window {{DeliveryWindow}}.",
    messageType: 'utility',
    templateContent: {
      field1: "Hi {{CustomerName}},\n\n✅ *Order Confirmed! #{{OrderID}}* ✅\n\nThanks for your order!\n\nYour order for {{TotalAmount}} has been successfully placed.\n\nWe'll notify you when it ships. Estimated delivery: {{DeliveryWindow}}.\n\nTrack progress: [OrderTrackingLink]",
      field2: "Hi {{CustomerName}},\n\n🎉 *Your {{AppName}} Order #{{OrderID}} is Confirmed!* 🎉\n\nWe've received your order totaling {{TotalAmount}}.\n\nExpected delivery: {{DeliveryWindow}}.\nYou can view your order details here: [OrderDetailsLink]\n\nThanks for shopping with us!",
      field3: "Hi {{CustomerName}},\n\nOrder #{{OrderID}} received!\n\nAmount: {{TotalAmount}}\nItems: {{ShortListOfItemsOrItemCount}}\n\nWe're preparing your order for shipment. You'll get another update soon!\n\n_Questions? Contact us at {{SupportEmailOrPhone}}._"
    }
  },
  {
    id: 16,
    title: 'Subscription Renewal',
    dataAiHint: "Remind user {{UserName}} their {{SubscriptionName}} subscription is renewing on {{RenewalDate}} for {{RenewalAmount}}.",
    messageType: 'utility',
    templateContent: {
      field1: "Hi {{UserName}},\n\n🔔 *Subscription Renewal Reminder* 🔔\n\nYour {{SubscriptionName}} subscription is due for renewal on *{{RenewalDate}}* for {{RenewalAmount}}.\n\nNo action is needed if you wish to continue. To manage your subscription: [SubscriptionManagementLink]\n\nThanks for being a valued subscriber!",
      field2: "Hi {{UserName}},\n\nHeads up!\n\nYour {{SubscriptionName}} plan will automatically renew on {{RenewalDate}}.\n\nAmount: {{RenewalAmount}}\n\nManage your subscription settings here: [Link]\n\n_Stay with us to keep enjoying {{KeyBenefit}}!_",
      field3: "Hi {{UserName}},\n\n🗓️ *Friendly Renewal Notice*\n\nYour {{SubscriptionName}} subscription is set to renew on {{RenewalDate}}.\n\nTo ensure uninterrupted access to {{Feature}}, no action is required. Your payment method will be charged {{RenewalAmount}}.\n\nUpdate payment or cancel: [LinkToAccount]"
    }
  },
  {
    id: 17,
    title: 'Support Ticket Received',
    dataAiHint: "Confirm receipt of {{UserName}}'s support query, provide ticket ID {{TicketID}}, and set {{ResponseTimeEstimate}} for response.",
    messageType: 'service',
    templateContent: {
      field1: "Hi {{UserName}},\n\n✅ *Support Ticket Received: #{{TicketID}}*\n\nThanks for contacting us! We've received your support request (Ticket ID: {{TicketID}}).\n\nOur team will get back to you within {{ResponseTimeEstimate_e.g.,_24_business_hours}}.\n\nRegards,\nThe {{AppName}} Support Team",
      field2: "Hi {{UserName}},\n\nGot it! 👍 Your support query has been logged as ticket *#{{TicketID}}*.\n\nWe're on it! Expect a response from our support specialists within {{ResponseTimeEstimate}}.\n\nIn the meantime, you might find our FAQ helpful: [FAQLink]",
      field3: "Hi {{UserName}},\n\nThis confirms we've received your inquiry (Ticket: *{{TicketID}}*).\n\nOur support ninjas are reviewing it and will reply as soon as possible, typically within {{ResponseTimeEstimate}}.\n\nThank you for your patience!"
    }
  },
  {
    id: 18,
    title: 'Post-Support Feedback',
    dataAiHint: "Ask {{UserName}} for feedback on recently resolved support ticket #{{TicketID}}.",
    messageType: 'service',
    templateContent: {
      field1: "Hi {{UserName}},\n\nWe see your support ticket #{{TicketID}} was recently resolved. We'd love to hear about your experience!\n\nCould you take a moment to rate our support? [FeedbackLink]\n\nYour feedback helps us improve! 🙏",
      field2: "Hi {{UserName}},\n\nHope we helped! 😊\n\nNow that your issue (Ticket #{{TicketID}}) is resolved, would you mind sharing your feedback on our service?\n\nIt's quick: [SurveyLink]\n\nThanks for helping us get better!",
      field3: "Hi {{UserName}},\n\n🌟 *How did we do?* 🌟\n\nRegarding your recent support interaction for ticket #{{TicketID}}, we'd appreciate your honest feedback.\n\nClick here to share your thoughts: [FeedbackFormLink]\n\n_Your input is invaluable!_"
    }
  },
  {
    id: 19,
    title: 'New User Welcome',
    dataAiHint: "Welcome new user {{UserName}} to {{AppName}}. Highlight a key feature {{KeyFeatureDescription}} or next step {{ActionableNextStep}}.",
    messageType: 'service',
    templateContent: {
      field1: "Hi {{UserName}}!\n\n🎉 *Welcome to {{AppName}}!* 🎉\n\nWe're thrilled to have you on board! Get started by exploring {{KeyFeatureDescription_e.g.,_our_dashboard}} here: [LinkToFeatureOrDashboard]\n\nQuestions? Check out our guide: [GettingStartedGuideLink]",
      field2: "Hi {{UserName}}! 👋\n\nWelcome to the {{AppName}} family!\n\nReady to dive in? Your first step could be to {{ActionableNextStep_e.g.,_set_up_your_profile}}.\n\nLet us know if you need anything!\n\n_The {{AppName}} Team_",
      field3: "Hi {{UserName}}!\n\nWelcome aboard, {{UserName}}! 🚀\n\nSuper excited you've joined {{AppName}}!\n\nHere's a quick tip to get you started: {{QuickTip}}.\n\nExplore more features: [AppFeaturesLink]\n\nHappy {{AppActivity_e.g.,_messaging}}!"
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
    const base = filteredTemplates;
    while(displayTemplates.length < 24 && base.length > 0) { // Aim for up to 24 templates for good infinite scroll feel
        displayTemplates = displayTemplates.concat(base);
    }
    // If still not enough after full passes, duplicate more aggressively to fill minimum rows
    if (displayTemplates.length === 0 && base.length > 0) displayTemplates = [...base, ...base, ...base]; // Ensure at least 3x if original is short
    else if (displayTemplates.length < 8 && displayTemplates.length > 0) { // If still less than 8, pad more
        const currentDisplay = [...displayTemplates];
        while(displayTemplates.length < Math.max(8, currentDisplay.length * 2)) { // Aim for at least 8, or double current if already that much
            displayTemplates = displayTemplates.concat(currentDisplay);
        }
    }
    displayTemplates = displayTemplates.slice(0,24); // Cap at 24
  }


  const itemsPerRow = Math.max(1, Math.ceil(displayTemplates.length / 3));
  const row1Templates = displayTemplates.slice(0, itemsPerRow);
  const row2Templates = displayTemplates.slice(itemsPerRow, itemsPerRow * 2);
  const row3Templates = displayTemplates.slice(itemsPerRow * 2, displayTemplates.length);


  const filterCategories: { label: string; value: FilterCategory; styleType?: MessageType }[] = [
    { label: "All", value: "all" },
    { label: "Marketing", value: "marketing", styleType: 'marketing' },
    { label: "Authentication", value: "authentication", styleType: 'authentication' },
    { label: "Utility", value: "utility", styleType: 'utility' },
    { label: "Service", value: "service", styleType: 'service' },
  ];

  return (
    <div className="pt-6 border-t border-border mt-6">
      <h3 className="text-xl font-semibold text-center mb-4 text-primary">
        Explore WhatsApp Templates
      </h3>
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {filterCategories.map(category => {
          const isActive = activeFilter === category.value;
          const baseButtonClasses = "rounded-full px-4 py-1.5 text-sm transition-all duration-200 ease-in-out shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2";
          let dynamicClasses = "";
          
          const commonHoverClasses = `hover:bg-[${whatsappColors.mainActiveGreen}] hover:text-white hover:border-[${whatsappColors.mainActiveGreen}]`;
          const commonFocusRing = `focus-visible:ring-[${whatsappColors.mainActiveGreen}]`;

          if (isActive) {
            dynamicClasses = `bg-[${whatsappColors.mainActiveGreen}] hover:bg-[${whatsappColors.hoverMainActiveGreen}] text-white border-[${whatsappColors.mainActiveGreen}] ${commonFocusRing}`;
          } else {
            if (category.styleType) {
              const initialColors = getTypeSpecificInitialColors(category.styleType);
              dynamicClasses = `bg-background border-[${initialColors.initialBorderColor}] text-[${initialColors.initialTextColor}] dark:text-[${initialColors.initialDarkTextColor}] ${commonHoverClasses} ${commonFocusRing}`;
            } else if (category.value === "all") { // "All" button inactive state
              dynamicClasses = `bg-background border-border text-foreground ${commonHoverClasses} ${commonFocusRing}`;
            }
          }

          return (
            <Button
              key={category.value}
              type="button"
              onClick={() => setActiveFilter(category.value)}
              className={cn(baseButtonClasses, dynamicClasses)}
            >
              {category.label}
            </Button>
          );
        })}
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
