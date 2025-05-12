"use client";

import Image from 'next/image';
import type { FC } from 'react';

export interface TemplateItemProps {
  id: number;
  title: string;
  imageUrl: string;
  dataAiHint: string; // This will be used as the context (user's text/idea) for the AI
  messageType: "marketing" | "authentication" | "utility" | "service"; // New: Explicit message type
  templateContent: { 
    field1?: string;
    field2?: string;
    field3?: string;
  };
  onClick: (template: TemplateItemProps) => void;
}

const TemplateItem: FC<TemplateItemProps> = (props) => {
  const { title, imageUrl, dataAiHint, onClick } = props; // dataAiHint is for image search, not AI context directly here
  return (
    <div
      className="flex-shrink-0 w-48 h-36 bg-card border border-border rounded-lg shadow-lg p-3 mx-3 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
      onClick={() => onClick(props)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(props);}}
    >
      <div className="w-full h-20 relative mb-2 overflow-hidden rounded-md">
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="transform group-hover:scale-105 transition-transform duration-300"
          data-ai-hint={props.dataAiHint.split(' ').slice(0, 2).join(' ')} // Keep image hint for search
        />
      </div>
      <p className="text-xs font-medium text-center text-foreground truncate w-full">
        {title}
      </p>
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
  const duplicatedTemplates = [...templates, ...templates, ...templates]; 
  
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
    title: 'Product Launch Announcement',
    imageUrl: 'https://picsum.photos/160/90?random=101',
    dataAiHint: 'Exciting new product launch with features and discount', // This becomes the "yourTextOrIdea"
    messageType: 'marketing',
    templateContent: {
      field1: "🚀 Exciting News, {{name}}! 🚀\nWe're thrilled to launch our new *{{product_name}}*!",
      field2: "✨ Features: {{feature1}}, {{feature2}}.\nSpecial launch offer: *{{discount}}% OFF* for 48 hours!",
      field3: "👉 Shop now: {{link}}\nDon't miss out! ⏱️"
    }
  },
  {
    id: 2,
    title: 'Flash Sale Alert',
    imageUrl: 'https://picsum.photos/160/90?random=102',
    dataAiHint: 'Urgent flash sale with big discounts on selected items',
    messageType: 'marketing',
    templateContent: {
      field1: "🚨 FLASH SALE ALERT! 🚨\nHey {{name}}! Our *BIGGEST Flash Sale* is ON NOW!",
      field2: "Up to *{{max_discount}}% OFF* on selected items like {{item1}} & {{item2}}.",
      field3: "🛍️ Shop: {{sale_link}}\nEnds in {{duration}}! ⏳"
    }
  },
  {
    id: 3,
    title: 'OTP Verification Code',
    imageUrl: 'https://picsum.photos/160/90?random=103',
    dataAiHint: 'Your secure one-time password for action',
    messageType: 'authentication',
    templateContent: {
      field1: "🔒 Your One-Time Password (OTP) 🔒",
      field2: "Hi {{name}},\nYour OTP for {{action}} is: ```{{otp_code}}```",
      field3: "Valid for {{validity_duration}}. Do not share it with anyone."
    }
  },
  {
    id: 4,
    title: 'Appointment Reminder',
    imageUrl: 'https://picsum.photos/160/90?random=104',
    dataAiHint: 'Friendly reminder for upcoming appointment details',
    messageType: 'utility',
    templateContent: {
      field1: "🗓️ Appointment Reminder 🗓️",
      field2: "Hi {{name}},\nJust a friendly reminder for your appointment with {{provider}} for {{service_type}}.",
      field3: "Date: *{{date}}* at *{{time}}*.\nLocation: {{location}}.\nTo reschedule, please call: {{contact_number}}."
    }
  },
  {
    id: 5,
    title: 'Order Shipped Notification',
    imageUrl: 'https://picsum.photos/160/90?random=105',
    dataAiHint: 'Update that your order has shipped with tracking info',
    messageType: 'utility',
    templateContent: {
      field1: "🚚 Your Order #{{order_id}} Has Shipped! 🚚",
      field2: "Great news, {{name}}! Your order containing {{item_summary}} is on its way!",
      field3: "Track your package here: {{tracking_link}}\nEstimated delivery: {{delivery_date}}."
    }
  },
  {
    id: 6,
    title: 'Support Ticket Update',
    imageUrl: 'https://picsum.photos/160/90?random=106',
    dataAiHint: 'An update on your support ticket inquiry',
    messageType: 'service',
    templateContent: {
      field1: "ℹ️ Support Ticket #{{ticket_id}} Update ℹ️",
      field2: "Hi {{name}},\nThere's an update regarding your support ticket \"{{ticket_subject}}\": {{update_summary}}.",
      field3: "View full details or reply here: {{portal_link}}\nBest regards,\n{{company_name}} Support Team"
    }
  },
  {
    id: 7,
    title: 'New User Welcome Message',
    imageUrl: 'https://picsum.photos/160/90?random=107',
    dataAiHint: 'Warm welcome to new user with getting started info',
    messageType: 'service',
    templateContent: {
      field1: "👋 Welcome to {{service_name}}, {{name}}! 👋",
      field2: "We're thrilled to have you on board! Here are a few tips to get started: {{getting_started_link}}",
      field3: "If you have any questions, feel free to reach out to us at {{support_email}} or visit our FAQ: {{faq_link}}"
    }
  },
   {
    id: 8,
    title: 'Abandoned Cart Reminder',
    imageUrl: 'https://picsum.photos/160/90?random=108',
    dataAiHint: 'Reminder about items left in cart with discount offer',
    messageType: 'marketing',
    templateContent: {
      field1: "🛒 Still thinking it over, {{name}}? 🛒",
      field2: "We noticed you left some awesome items in your cart, including the *{{product_in_cart}}*.",
      field3: "Complete your purchase today and enjoy a special *{{discount_offer}}% discount* just for you! Use code: ```{{discount_code}}```\nCheckout here: {{cart_link}}"
    }
  }
];

const displayTemplates = whatsAppTemplates.slice(0, 8);

interface TemplateGalleryProps {
  onTemplateClick: (template: TemplateItemProps) => void;
}

const TemplateGallery: FC<TemplateGalleryProps> = ({ onTemplateClick }) => {
  // Ensure we pass the correct type to TemplateRow
  const typedDisplayTemplates = displayTemplates as unknown as TemplateItemProps[];

  return (
    <div className="pt-6 border-t border-border mt-6">
      <h3 className="text-xl font-semibold text-center mb-6 text-primary">
        Explore WhatsApp FormFlow Templates
      </h3>
      <TemplateRow templates={typedDisplayTemplates.slice(0, 7)} direction="left" speed="60s" onTemplateClick={onTemplateClick} />
      <TemplateRow templates={typedDisplayTemplates.slice(1, 8).length >=1 ? typedDisplayTemplates.slice(1,8) : typedDisplayTemplates.slice(0,1) } direction="right" speed="75s" onTemplateClick={onTemplateClick} />
      <TemplateRow templates={typedDisplayTemplates.slice(0, 7)} direction="left" speed="65s" onTemplateClick={onTemplateClick} />
    </div>
  );
};

export default TemplateGallery;
