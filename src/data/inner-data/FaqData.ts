interface DataType {
  id: number;
  id_name: string;
  title: string;
  md_pt?: boolean;
  faq: {
    id: number;
    question: string;
    answer: string;
  }[];
}

const inner_faq_data: DataType[] = [
  {
    id: 1,
    id_name: "Selling",
    title: "SELLING PROPERTIES",
    md_pt: true,
    faq: [
      {
        id: 1,
        question: "How do I list my property on RoomFinder?",
        answer:
          "To list your property, create an account and go to the dashboard. Click 'Add Property' and fill in all required details including property type, location, price, amenities, and upload photos. Once submitted, our team will review and approve your listing within 24 hours.",
      },
      {
        id: 2,
        question:
          "What information do I need to provide when listing a property?",
        answer:
          "You'll need to provide: property type, location (address, city), price, number of bedrooms/bathrooms, square footage, amenities, detailed description, high-quality photos, contact information, and availability status. The more detailed your listing, the better your chances of finding tenants or buyers.",
      },
      {
        id: 3,
        question: "How much does it cost to list a property?",
        answer:
          "Basic property listings are free on RoomFinder. Premium features like featured listings, priority placement, and advanced analytics are available for a small fee. Contact our support team for detailed pricing information.",
      },
      {
        id: 4,
        question: "Can I edit my property listing after posting?",
        answer:
          "Yes, you can edit your property listing anytime through your dashboard. Simply go to 'My Properties', select the property you want to edit, and update the information. Changes are typically reflected within a few hours.",
      },
    ],
  },
  {
    id: 2,
    id_name: "Renting",
    title: "RENTING PROPERTIES",
    faq: [
      {
        id: 5,
        question: "How do I search for rental properties?",
        answer:
          "Use our search filters to find properties by location, price range, number of bedrooms, property type, and amenities. You can also save your search criteria and receive notifications when new properties matching your criteria become available.",
      },
      {
        id: 6,
        question: "How do I contact a property owner or agent?",
        answer:
          "Once you find a property you're interested in, click on the listing to view details. You can then use the contact form, call the provided phone number, or send a direct message through our platform. All communications are logged for your reference.",
      },
      {
        id: 7,
        question: "What documents do I need to rent a property?",
        answer:
          "Typically, you'll need: proof of identity (ID card or passport), proof of income (employment letter, bank statements), references from previous landlords, and a security deposit. Requirements may vary by property owner.",
      },
      {
        id: 8,
        question: "Can I schedule property viewings through RoomFinder?",
        answer:
          "Yes, you can request property viewings directly through our platform. Property owners and agents will respond to schedule convenient viewing times. You can also use our virtual tour feature for initial property exploration.",
      },
    ],
  },
  {
    id: 3,
    id_name: "Buying",
    title: "BUYING PROPERTIES",
    faq: [
      {
        id: 9,
        question: "How do I find properties for sale?",
        answer:
          "Use our advanced search filters to find properties for sale by location, price range, property type, and features. You can also browse featured properties or set up alerts for new listings in your preferred areas.",
      },
      {
        id: 10,
        question: "What financing options are available?",
        answer:
          "RoomFinder partners with various banks and financial institutions in Cameroon. We can connect you with mortgage specialists who can help you understand available financing options, interest rates, and payment terms.",
      },
      {
        id: 11,
        question: "How do I verify property ownership and legal status?",
        answer:
          "We recommend working with qualified real estate agents and lawyers to verify property ownership, check for liens, and ensure all legal documents are in order. RoomFinder provides a platform for connections but doesn't handle legal verification.",
      },
    ],
  },
  {
    id: 4,
    id_name: "Payments",
    title: "PAYMENTS & WALLET",
    faq: [
      {
        id: 12,
        question: "What payment methods does RoomFinder accept?",
        answer:
          "RoomFinder accepts mobile money payments (MTN Mobile Money and Orange Money), bank transfers, and cash payments. All online transactions are processed through secure payment gateways to ensure your financial information is protected.",
      },
      {
        id: 13,
        question: "How does the RoomFinder wallet work?",
        answer:
          "The RoomFinder wallet allows you to store funds for premium services, featured listings, and other platform features. You can top up your wallet using mobile money or bank transfers. Transaction history is available in your dashboard.",
      },
      {
        id: 14,
        question: "Is my payment information secure?",
        answer:
          "Yes, RoomFinder uses industry-standard encryption and security protocols to protect your payment information. We never store your complete payment details on our servers and all transactions are processed through secure third-party providers.",
      },
    ],
  },
  {
    id: 5,
    id_name: "Terms",
    title: "TERMS & CONDITIONS",
    faq: [
      {
        id: 15,
        question: "What are the terms of service for using RoomFinder?",
        answer:
          "By using RoomFinder, you agree to provide accurate information, respect other users, and comply with our community guidelines. You can view our complete Terms and Conditions at /terms for detailed information about your rights and responsibilities.",
      },
      {
        id: 16,
        question: "What happens if I violate the terms of service?",
        answer:
          "Violations of our terms may result in warnings, temporary suspension, or permanent account termination depending on the severity. We reserve the right to remove inappropriate content and take action against users who violate our policies.",
      },
    ],
  },
  {
    id: 6,
    id_name: "Account",
    title: "ACCOUNT & PROFILE",
    faq: [
      {
        id: 17,
        question: "How do I create an account on RoomFinder?",
        answer:
          "Click the 'Register' button on our homepage and fill in your details including name, email, phone number, and password. You'll receive a verification email to activate your account. Once verified, you can start using all platform features.",
      },
      {
        id: 18,
        question: "How do I update my profile information?",
        answer:
          "Log into your account and go to the dashboard. Click on 'Profile' to edit your personal information, contact details, and preferences. You can also upload a profile picture and manage your notification settings.",
      },
    ],
  },
];

export default inner_faq_data;
