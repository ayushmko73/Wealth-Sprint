// Decision data for the first 10 days of Wealth Sprint
// Each day has unique scenarios covering various aspects of wealth building

export interface DecisionOption {
  id: string;
  text: string;
  consequences: {
    financial?: number;
    emotion?: number;
    stress?: number;
    karma?: number;
    logic?: number;
    reputation?: number;
    energy?: number;
    description: string;
  };
}

export interface Decision {
  id: string;
  day: number;
  question: string;
  category: 'real_estate' | 'business' | 'transport' | 'technology' | 'lifestyle' | 'unexpected' | 'partnership' | 'investment' | 'relationships' | 'support';
  sector?: 'fast_food' | 'tech_startups' | 'ecommerce' | 'healthcare' | 'general'; // New sector field
  options: DecisionOption[];
}

export const DAILY_DECISIONS: Record<number, Decision[]> = {
  // Day 1: 2 decisions
  1: [
    {
      id: "d1_real_estate_1",
      day: 1,
      question: "Your colleague mentions a small apartment in the suburbs for ₹25 lakhs. The area is developing but currently has limited infrastructure. Do you make an offer?",
      category: "real_estate",
      sector: "general",
      options: [
        {
          id: "d1_r1_buy",
          text: "Yes, buy the apartment as an investment",
          consequences: {
            financial: -250000,
            logic: 5,
            stress: 10,
            reputation: 5,
            description: "Invested ₹25L in suburban property. Potential for future growth but current stress from large expense."
          }
        },
        {
          id: "d1_r1_wait",
          text: "No, wait for better opportunities",
          consequences: {
            logic: 3,
            energy: 5,
            description: "Maintained liquidity and avoided hasty investment. Feeling more energetic about future prospects."
          }
        },
        {
          id: "d1_r1_research",
          text: "Ask for time to research the area thoroughly",
          consequences: {
            logic: 8,
            stress: -5,
            description: "Chose careful analysis over quick decisions. Reduced stress and improved analytical thinking."
          }
        }
      ]
    },
    {
      id: "d1_lifestyle_1",
      day: 1,
      question: "Your friends invite you to an expensive weekend getaway to Goa that costs ₹15,000. You've been working hard and could use the break.",
      category: "lifestyle",
      sector: "general",
      options: [
        {
          id: "d1_l1_go",
          text: "Join them - life is about experiences",
          consequences: {
            financial: -15000,
            emotion: 15,
            energy: 10,
            stress: -10,
            reputation: 3,
            description: "Spent ₹15K on Goa trip. Feeling refreshed and emotionally fulfilled from quality time with friends."
          }
        },
        {
          id: "d1_l1_decline",
          text: "Decline politely and save the money",
          consequences: {
            logic: 5,
            emotion: -5,
            stress: 5,
            description: "Saved ₹15K by skipping Goa. Logical financial choice but missing out on social connections."
          }
        },
        {
          id: "d1_l1_compromise",
          text: "Suggest a local day trip instead",
          consequences: {
            financial: -3000,
            emotion: 8,
            karma: 5,
            reputation: 2,
            description: "Spent ₹3K on local trip. Found middle ground between saving and socializing."
          }
        }
      ]
    }
  ],

  // Day 2: 3 decisions
  2: [
    {
      id: "d2_business_1",
      day: 2,
      question: "A friend wants to start a cloud kitchen specializing in healthy meals. They're looking for a ₹50,000 investment for a 20% stake in the business.",
      category: "business",
      sector: "fast_food",
      options: [
        {
          id: "d2_b1_invest",
          text: "Invest ₹50K for 20% stake",
          consequences: {
            financial: -50000,
            logic: 7,
            stress: 15,
            description: "Invested ₹50K in cloud kitchen startup. High potential but increased stress from business risk."
          }
        },
        {
          id: "d2_b1_negotiate",
          text: "Negotiate for 25% stake for same amount",
          consequences: {
            financial: -50000,
            logic: 10,
            karma: -3,
            description: "Secured 25% stake for ₹50K investment. Better deal but strained friendship slightly."
          }
        },
        {
          id: "d2_b1_decline",
          text: "Decline the investment opportunity",
          consequences: {
            energy: 5,
            emotion: -3,
            description: "Avoided investment risk but may have missed potential opportunity."
          }
        }
      ]
    },
    {
      id: "d2_technology_1",
      day: 2,
      question: "Your laptop is getting slow for work. You can either upgrade your current one for ₹20K or buy a new high-performance laptop for ₹80K.",
      category: "technology",
      options: [
        {
          id: "d2_t1_upgrade",
          text: "Upgrade current laptop for ₹20K",
          consequences: {
            financial: -20000,
            logic: 8,
            energy: 5,
            description: "Smart upgrade for ₹20K. Improved performance without overspending."
          }
        },
        {
          id: "d2_t1_new",
          text: "Buy new laptop for ₹80K",
          consequences: {
            financial: -80000,
            energy: 15,
            stress: 8,
            description: "Invested ₹80K in premium laptop. High performance but significant expense."
          }
        },
        {
          id: "d2_t1_wait",
          text: "Continue with current laptop for now",
          consequences: {
            stress: 10,
            energy: -5,
            logic: 3,
            description: "Avoided expense but daily frustration with slow performance affecting productivity."
          }
        }
      ]
    },
    {
      id: "d2_relationships_1",
      day: 2,
      question: "Your childhood friend Arjun calls you late at night, feeling depressed about his job. He needs someone to talk to but you have an early meeting tomorrow.",
      category: "relationships",
      options: [
        {
          id: "d2_rel1_listen",
          text: "Stay up and listen to Arjun's problems",
          consequences: {
            emotion: 10,
            karma: 15,
            energy: -10,
            description: "Supported Arjun through difficult time. Strengthened friendship but lost sleep before important meeting."
          }
        },
        {
          id: "d2_rel1_schedule",
          text: "Ask to talk tomorrow after your meeting",
          consequences: {
            logic: 5,
            emotion: -5,
            karma: -5,
            description: "Prioritized work commitment but friend felt unsupported in moment of need."
          }
        },
        {
          id: "d2_rel1_brief",
          text: "Talk for 15 minutes then suggest calling tomorrow",
          consequences: {
            emotion: 7,
            karma: 8,
            energy: -3,
            description: "Provided immediate support while maintaining boundaries. Balanced approach to friendship and responsibility."
          }
        }
      ]
    }
  ],

  // Day 3: 2 decisions
  3: [
    {
      id: "d3_transport_1",
      day: 3,
      question: "Your old bike needs expensive repairs worth ₹12K. Alternatively, you could buy a second-hand car for ₹3 lakhs or a new bike for ₹1.5 lakhs.",
      category: "transport",
      options: [
        {
          id: "d3_tr1_repair",
          text: "Repair the old bike for ₹12K",
          consequences: {
            financial: -12000,
            logic: 8,
            stress: -5,
            description: "Cost-effective repair for ₹12K. Extended bike life without major investment."
          }
        },
        {
          id: "d3_tr1_car",
          text: "Buy second-hand car for ₹3L",
          consequences: {
            financial: -300000,
            energy: 10,
            stress: 15,
            description: "Major upgrade to car for ₹3L. Enhanced comfort but significant financial commitment."
          }
        },
        {
          id: "d3_tr1_newbike",
          text: "Buy new bike for ₹1.5L",
          consequences: {
            financial: -150000,
            energy: 8,
            emotion: 5,
            description: "New bike for ₹1.5L. Good middle ground between repair and car purchase."
          }
        }
      ]
    },
    {
      id: "d3_unexpected_1",
      day: 3,
      question: "You receive a call that your grandmother is in the hospital and needs ₹40K for treatment. Your family is looking to you for financial support.",
      category: "unexpected",
      options: [
        {
          id: "d3_un1_full",
          text: "Pay the full ₹40K immediately",
          consequences: {
            financial: -40000,
            emotion: 10,
            karma: 20,
            stress: 8,
            description: "Fully supported grandmother's treatment. Family grateful but personal finances strained."
          }
        },
        {
          id: "d3_un1_partial",
          text: "Contribute ₹20K and coordinate with relatives",
          consequences: {
            financial: -20000,
            emotion: 5,
            karma: 10,
            logic: 8,
            description: "Contributed ₹20K while organizing family support. Balanced approach to family emergency."
          }
        },
        {
          id: "d3_un1_loan",
          text: "Offer to arrange a loan but can't pay directly",
          consequences: {
            emotion: -8,
            karma: -10,
            stress: 15,
            description: "Unable to provide direct financial support. Family disappointed and personal guilt increased."
          }
        }
      ]
    }
  ],

  // Day 4: 3 decisions (random selection from 4 prepared)
  4: [
    {
      id: "d4_partnership_1",
      day: 4,
      question: "A senior colleague proposes starting a consulting firm together. They want equal partnership but you'd need to invest ₹1.5 lakhs in initial setup.",
      category: "partnership",
      options: [
        {
          id: "d4_p1_equal",
          text: "Accept equal partnership with ₹1.5L investment",
          consequences: {
            financial: -150000,
            logic: 5,
            stress: 20,
            reputation: 10,
            description: "Entered consulting partnership. High potential but significant risk and stress from large investment."
          }
        },
        {
          id: "d4_p1_negotiate",
          text: "Negotiate for 60% stake given higher investment",
          consequences: {
            financial: -150000,
            logic: 12,
            karma: -5,
            reputation: 8,
            description: "Secured majority stake for same investment. Business savvy but potentially strained partnership."
          }
        },
        {
          id: "d4_p1_decline",
          text: "Decline and focus on current job",
          consequences: {
            energy: 8,
            emotion: -5,
            reputation: -3,
            description: "Maintained job security but missed entrepreneurial opportunity. Colleague feels rejected."
          }
        }
      ]
    },
    {
      id: "d4_investment_1",
      day: 4,
      question: "Your bank advisor suggests investing ₹2 lakhs in a mutual fund with good historical returns but no guaranteed outcomes.",
      category: "investment",
      options: [
        {
          id: "d4_i1_invest",
          text: "Invest ₹2L in the mutual fund",
          consequences: {
            financial: -200000,
            logic: 6,
            stress: 12,
            description: "Invested ₹2L in mutual funds. Professional approach to wealth building but market risk concerns."
          }
        },
        {
          id: "d4_i1_sip",
          text: "Start SIP of ₹20K monthly instead",
          consequences: {
            logic: 15,
            stress: -5,
            description: "Chose systematic investment approach. Reduces risk while building disciplined investment habit."
          }
        },
        {
          id: "d4_i1_research",
          text: "Research other investment options first",
          consequences: {
            logic: 10,
            energy: -5,
            description: "Prioritized thorough research. Time-consuming but leads to more informed decisions."
          }
        }
      ]
    },
    {
      id: "d4_support_1",
      day: 4,
      question: "Your friend Priya is going through a breakup and asks if she can stay at your place for a week while she finds a new apartment.",
      category: "support",
      options: [
        {
          id: "d4_s1_yes",
          text: "Offer your home for the week",
          consequences: {
            emotion: 8,
            karma: 15,
            energy: -8,
            stress: 10,
            description: "Supported Priya during difficult time. Strengthened friendship but disrupted personal routine."
          }
        },
        {
          id: "d4_s1_hotel",
          text: "Pay for her hotel stay instead",
          consequences: {
            financial: -15000,
            emotion: 5,
            karma: 8,
            description: "Provided financial support while maintaining boundaries. ₹15K expense but preserved privacy."
          }
        },
        {
          id: "d4_s1_help_search",
          text: "Help her search for apartments online",
          consequences: {
            emotion: 3,
            karma: 5,
            energy: -3,
            description: "Offered practical help without major personal impact. Moderate support for friend in need."
          }
        }
      ]
    }
  ],

  // Day 5: 2 decisions (random selection from 3 prepared)
  5: [
    {
      id: "d5_business_1",
      day: 5,
      question: "A local restaurant is selling their profitable food truck business for ₹4 lakhs. They claim it generates ₹50K monthly profit.",
      category: "business",
      options: [
        {
          id: "d5_b1_buy",
          text: "Purchase the food truck business",
          consequences: {
            financial: -400000,
            stress: 25,
            energy: -10,
            description: "Acquired food truck for ₹4L. High potential income but significant stress from business management."
          }
        },
        {
          id: "d5_b1_verify",
          text: "Ask for financial records before deciding",
          consequences: {
            logic: 15,
            stress: -5,
            description: "Demanded proper due diligence. Professional approach reduces risk of poor investment."
          }
        },
        {
          id: "d5_b1_pass",
          text: "Pass on the opportunity",
          consequences: {
            energy: 5,
            emotion: -3,
            description: "Avoided potential business complications but may have missed profitable venture."
          }
        }
      ]
    },
    {
      id: "d5_lifestyle_1",
      day: 5,
      question: "Your company offers a health insurance upgrade for ₹25K annually that covers advanced treatments and overseas medical care.",
      category: "lifestyle",
      options: [
        {
          id: "d5_l1_upgrade",
          text: "Purchase the premium health insurance",
          consequences: {
            financial: -25000,
            logic: 12,
            stress: -8,
            description: "Invested ₹25K in premium health coverage. Peace of mind and protection against major medical expenses."
          }
        },
        {
          id: "d5_l1_basic",
          text: "Keep basic company insurance",
          consequences: {
            logic: 5,
            stress: 3,
            description: "Maintained basic coverage to save money. Some concern about potential gaps in protection."
          }
        },
        {
          id: "d5_l1_research",
          text: "Research other insurance providers",
          consequences: {
            logic: 8,
            energy: -5,
            description: "Chose to compare options thoroughly. Time-consuming but may find better deals."
          }
        }
      ]
    }
  ],

  // Day 6: 4 decisions (random selection for variety)
  6: [
    {
      id: "d6_technology_1",
      day: 6,
      question: "A startup offers you shares worth ₹1 lakh in exchange for building their mobile app. The work would take 3 months part-time.",
      category: "technology",
      options: [
        {
          id: "d6_t1_accept",
          text: "Accept the equity deal",
          consequences: {
            energy: -15,
            stress: 20,
            reputation: 10,
            description: "Took on app development project. Potential high returns but significant time commitment and stress."
          }
        },
        {
          id: "d6_t1_cash",
          text: "Ask for cash payment instead",
          consequences: {
            financial: 100000,
            logic: 8,
            reputation: 5,
            description: "Negotiated ₹1L cash payment. Immediate benefit but missed potential equity upside."
          }
        },
        {
          id: "d6_t1_decline",
          text: "Decline due to time constraints",
          consequences: {
            energy: 8,
            emotion: -3,
            description: "Preserved work-life balance but missed potential income opportunity."
          }
        }
      ]
    },
    {
      id: "d6_real_estate_1",
      day: 6,
      question: "Your landlord offers to sell your current apartment to you for ₹35 lakhs. Market rate is ₹40 lakhs but you'd need to arrange financing.",
      category: "real_estate",
      options: [
        {
          id: "d6_r1_buy",
          text: "Arrange loan and buy the apartment",
          consequences: {
            financial: -350000,
            stress: 18,
            logic: 10,
            description: "Secured below-market property deal. Good investment but loan stress and ₹35L commitment."
          }
        },
        {
          id: "d6_r1_negotiate",
          text: "Negotiate for ₹32 lakhs",
          consequences: {
            financial: -320000,
            stress: 15,
            logic: 12,
            karma: -3,
            description: "Negotiated better price at ₹32L. Excellent deal but landlord slightly unhappy."
          }
        },
        {
          id: "d6_r1_rent",
          text: "Continue renting for flexibility",
          consequences: {
            energy: 5,
            emotion: -5,
            description: "Maintained rental flexibility but missed opportunity to own below-market property."
          }
        }
      ]
    },
    {
      id: "d6_relationships_1",
      day: 6,
      question: "Your cousin Rahul wants to borrow ₹75K for his wedding expenses. He promises to return it in 6 months but has a history of delayed payments.",
      category: "relationships",
      options: [
        {
          id: "d6_rel1_lend",
          text: "Lend the full ₹75K for the wedding",
          consequences: {
            financial: -75000,
            emotion: 8,
            karma: 12,
            stress: 15,
            description: "Supported cousin's wedding with ₹75K loan. Family appreciation but financial risk given his payment history."
          }
        },
        {
          id: "d6_rel1_partial",
          text: "Offer ₹30K as a gift, not loan",
          consequences: {
            financial: -30000,
            emotion: 5,
            karma: 8,
            logic: 10,
            description: "Gave ₹30K wedding gift instead of loan. Avoided repayment complications while supporting family."
          }
        },
        {
          id: "d6_rel1_decline",
          text: "Politely decline citing past experiences",
          consequences: {
            emotion: -8,
            karma: -10,
            stress: 8,
            description: "Protected finances but created family tension. Cousin felt rejected during important life event."
          }
        }
      ]
    },
    {
      id: "d6_unexpected_1",
      day: 6,
      question: "You discover your company's stock options are about to expire. Exercising them costs ₹60K but could be worth ₹1.2L if the company goes public.",
      category: "unexpected",
      options: [
        {
          id: "d6_un1_exercise",
          text: "Exercise the stock options",
          consequences: {
            financial: -60000,
            stress: 12,
            logic: 8,
            description: "Invested ₹60K in company stock options. High potential returns but uncertain outcome."
          }
        },
        {
          id: "d6_un1_sell",
          text: "Sell the options to another employee",
          consequences: {
            financial: 25000,
            logic: 10,
            emotion: -3,
            description: "Sold options for ₹25K immediate gain. Safe choice but missed potential bigger returns."
          }
        },
        {
          id: "d6_un1_expire",
          text: "Let them expire to avoid risk",
          consequences: {
            stress: -5,
            emotion: -8,
            description: "Avoided investment risk but regret over potentially missing significant opportunity."
          }
        }
      ]
    }
  ],

  // Day 7: 3 decisions
  7: [
    {
      id: "d7_transport_1",
      day: 7,
      question: "Uber offers you a partnership to run 3 vehicles in their fleet. You'd invest ₹12 lakhs but earn ₹45K monthly after expenses.",
      category: "transport",
      options: [
        {
          id: "d7_tr1_invest",
          text: "Invest ₹12L in Uber fleet partnership",
          consequences: {
            financial: -1200000,
            stress: 30,
            energy: -15,
            description: "Major ₹12L investment in Uber fleet. Potential steady income but huge financial commitment and operational stress."
          }
        },
        {
          id: "d7_tr1_single",
          text: "Start with one vehicle for ₹4L",
          consequences: {
            financial: -400000,
            stress: 18,
            logic: 12,
            description: "Conservative start with ₹4L single vehicle. Manageable risk while testing the business model."
          }
        },
        {
          id: "d7_tr1_decline",
          text: "Decline the partnership offer",
          consequences: {
            energy: 8,
            emotion: -5,
            description: "Avoided transportation business complications but missed potential passive income stream."
          }
        }
      ]
    },
    {
      id: "d7_support_1",
      day: 7,
      question: "Your mentor Ashish calls with news that he's being laid off after 15 years. He's devastated and asks if you know any opportunities.",
      category: "support",
      options: [
        {
          id: "d7_s1_network",
          text: "Immediately reach out to your network for him",
          consequences: {
            emotion: 10,
            karma: 20,
            energy: -8,
            reputation: 5,
            description: "Used personal network to help Ashish. Strengthened mentor relationship and built positive reputation."
          }
        },
        {
          id: "d7_s1_referral",
          text: "Offer to refer him at your company",
          consequences: {
            emotion: 8,
            karma: 15,
            stress: 10,
            description: "Referred Ashish to your company. Supported mentor but created pressure if hiring doesn't work out."
          }
        },
        {
          id: "d7_s1_advice",
          text: "Provide career guidance and moral support",
          consequences: {
            emotion: 5,
            karma: 8,
            energy: -3,
            description: "Offered emotional support and career advice. Helpful but limited practical impact on his situation."
          }
        }
      ]
    },
    {
      id: "d7_business_1",
      day: 7,
      question: "A trending cryptocurrency exchange wants you to invest ₹2 lakhs in their token presale, promising 300% returns in 6 months.",
      category: "business",
      options: [
        {
          id: "d7_b1_invest",
          text: "Invest ₹2L in the crypto presale",
          consequences: {
            financial: -200000,
            stress: 25,
            emotion: 8,
            description: "High-risk ₹2L crypto investment. Exciting potential but extreme volatility and regulatory uncertainty."
          }
        },
        {
          id: "d7_b1_small",
          text: "Invest small amount ₹25K to test",
          consequences: {
            financial: -25000,
            stress: 8,
            logic: 10,
            description: "Conservative ₹25K crypto investment. Limited risk exposure while participating in potential upside."
          }
        },
        {
          id: "d7_b1_avoid",
          text: "Avoid cryptocurrency investments entirely",
          consequences: {
            logic: 12,
            stress: -5,
            emotion: -3,
            description: "Avoided crypto risk completely. Conservative approach but potential regret if prices surge."
          }
        }
      ]
    }
  ],

  // Day 8: 4 decisions
  8: [
    {
      id: "d8_lifestyle_1",
      day: 8,
      question: "Your gym membership expires and they offer: Basic (₹8K/year), Premium with trainer (₹25K/year), or home equipment setup (₹45K one-time).",
      category: "lifestyle",
      options: [
        {
          id: "d8_l1_basic",
          text: "Choose basic gym membership",
          consequences: {
            financial: -8000,
            energy: 8,
            logic: 10,
            description: "Cost-effective ₹8K gym membership. Good balance of health investment and financial prudence."
          }
        },
        {
          id: "d8_l1_premium",
          text: "Get premium membership with trainer",
          consequences: {
            financial: -25000,
            energy: 15,
            stress: -8,
            description: "Premium ₹25K gym investment. Professional guidance likely to improve health and reduce stress."
          }
        },
        {
          id: "d8_l1_home",
          text: "Buy home equipment for ₹45K",
          consequences: {
            financial: -45000,
            energy: 10,
            logic: 8,
            description: "₹45K home gym setup. Long-term convenience but higher upfront cost and self-discipline required."
          }
        }
      ]
    },
    {
      id: "d8_investment_1",
      day: 8,
      question: "Your financial advisor suggests diversifying with gold investment. Options: Physical gold (₹1.5L), Gold ETF (₹1.5L), or Gold bonds (₹1.5L).",
      category: "investment",
      options: [
        {
          id: "d8_i1_physical",
          text: "Buy physical gold worth ₹1.5L",
          consequences: {
            financial: -150000,
            stress: 8,
            logic: 5,
            description: "₹1.5L physical gold investment. Traditional hedge but storage concerns and lower liquidity."
          }
        },
        {
          id: "d8_i1_etf",
          text: "Invest in Gold ETF",
          consequences: {
            financial: -150000,
            stress: 5,
            logic: 12,
            description: "₹1.5L Gold ETF investment. Modern approach with better liquidity and no storage issues."
          }
        },
        {
          id: "d8_i1_bonds",
          text: "Purchase Sovereign Gold Bonds",
          consequences: {
            financial: -150000,
            stress: 3,
            logic: 15,
            description: "₹1.5L Sovereign Gold Bonds. Best of both worlds with government backing and additional interest."
          }
        }
      ]
    },
    {
      id: "d8_relationships_1",
      day: 8,
      question: "You're developing feelings for your colleague Meera. She seems interested too, but dating coworkers is against company policy.",
      category: "relationships",
      options: [
        {
          id: "d8_rel1_pursue",
          text: "Ask Meera out despite the policy",
          consequences: {
            emotion: 15,
            stress: 15,
            reputation: -8,
            description: "Pursued romantic feelings despite company policy. Potential happiness but career risk."
          }
        },
        {
          id: "d8_rel1_wait",
          text: "Wait until one of you changes jobs",
          consequences: {
            emotion: -5,
            logic: 10,
            stress: 8,
            description: "Chose career safety over immediate romance. Responsible but emotionally frustrating."
          }
        },
        {
          id: "d8_rel1_friend",
          text: "Maintain professional friendship",
          consequences: {
            emotion: 3,
            logic: 8,
            karma: 5,
            description: "Balanced personal feelings with professional boundaries. Mature approach to workplace relationships."
          }
        }
      ]
    },
    {
      id: "d8_technology_1",
      day: 8,
      question: "A friend offers to teach you day trading in exchange for ₹30K fees. He claims to make ₹50K monthly but you've heard about trading risks.",
      category: "technology",
      options: [
        {
          id: "d8_t1_learn",
          text: "Pay ₹30K to learn day trading",
          consequences: {
            financial: -30000,
            stress: 20,
            logic: -5,
            description: "₹30K day trading course investment. High-risk education with potential for significant losses."
          }
        },
        {
          id: "d8_t1_free",
          text: "Learn trading through free online resources",
          consequences: {
            logic: 12,
            energy: -8,
            stress: 5,
            description: "Self-taught trading approach. Saved money but requires significant time investment and discipline."
          }
        },
        {
          id: "d8_t1_avoid",
          text: "Focus on long-term investing instead",
          consequences: {
            logic: 15,
            stress: -5,
            description: "Chose proven long-term investment strategy over speculative trading. Conservative but statistically sound."
          }
        }
      ]
    }
  ],

  // Day 9: 2 decisions
  9: [
    {
      id: "d9_unexpected_1",
      day: 9,
      question: "Your old college friend surprises you with news that your shared startup idea from years ago is now worth millions. He offers you 5% equity for ₹3 lakhs.",
      category: "unexpected",
      options: [
        {
          id: "d9_un1_invest",
          text: "Invest ₹3L for 5% equity",
          consequences: {
            financial: -300000,
            emotion: 12,
            stress: 20,
            description: "₹3L investment in former startup idea. Emotional validation but significant financial risk."
          }
        },
        {
          id: "d9_un1_negotiate",
          text: "Negotiate for 8% given original contribution",
          consequences: {
            financial: -300000,
            emotion: 8,
            karma: -5,
            logic: 10,
            description: "Secured better equity terms but strained old friendship. Business-focused approach to personal relationship."
          }
        },
        {
          id: "d9_un1_decline",
          text: "Congratulate but decline investment",
          consequences: {
            emotion: -10,
            energy: 5,
            description: "Protected finances but potential regret over missing out on successful venture."
          }
        }
      ]
    },
    {
      id: "d9_partnership_1",
      day: 9,
      question: "A successful entrepreneur wants you to quit your job and join their new fintech startup as co-founder. Salary would be 50% of current but huge equity upside.",
      category: "partnership",
      options: [
        {
          id: "d9_p1_join",
          text: "Quit job and join as co-founder",
          consequences: {
            financial: -37500,
            stress: 30,
            energy: 20,
            reputation: 15,
            description: "Major career pivot to startup co-founder. Reduced salary but potential for massive upside."
          }
        },
        {
          id: "d9_p1_parttime",
          text: "Negotiate part-time involvement",
          consequences: {
            stress: 25,
            energy: -10,
            logic: 10,
            description: "Balanced approach keeping job while participating in startup. Exhausting but lower risk."
          }
        },
        {
          id: "d9_p1_decline",
          text: "Stay in current stable job",
          consequences: {
            energy: 8,
            emotion: -8,
            reputation: -5,
            description: "Chose job security over entrepreneurial opportunity. Safe but potential regret about missed chance."
          }
        }
      ]
    }
  ],

  // Day 10: 5 decisions (maximum variety for final day)
  10: [
    {
      id: "d10_real_estate_1",
      day: 10,
      question: "A real estate developer offers you early bird pricing on a commercial space: ₹50 lakhs now vs ₹70 lakhs after launch. High rental yield expected.",
      category: "real_estate",
      options: [
        {
          id: "d10_r1_early",
          text: "Buy at early bird price ₹50L",
          consequences: {
            financial: -5000000,
            stress: 35,
            logic: 8,
            description: "Major ₹50L commercial property investment. Significant financial commitment but good pricing advantage."
          }
        },
        {
          id: "d10_r1_wait",
          text: "Wait to see post-launch performance",
          consequences: {
            logic: 12,
            stress: -5,
            emotion: -5,
            description: "Conservative approach to large investment. Reduced risk but potentially missed opportunity."
          }
        },
        {
          id: "d10_r1_partner",
          text: "Find partners to invest jointly",
          consequences: {
            financial: -1666667,
            stress: 15,
            logic: 15,
            description: "Smart partnership approach reduced individual risk to ₹16.7L while maintaining opportunity."
          }
        }
      ]
    },
    {
      id: "d10_support_1",
      day: 10,
      question: "Your younger brother calls in tears. He failed his engineering exam and feels like giving up on his dreams. He needs emotional support and possibly a career change.",
      category: "support",
      options: [
        {
          id: "d10_s1_support",
          text: "Take time off to counsel and support him",
          consequences: {
            emotion: 15,
            karma: 25,
            energy: -12,
            description: "Prioritized family over work commitments. Brother feels deeply supported but personal projects delayed."
          }
        },
        {
          id: "d10_s1_finance",
          text: "Offer to fund his alternative career training",
          consequences: {
            financial: -75000,
            emotion: 10,
            karma: 18,
            description: "₹75K investment in brother's future. Financial sacrifice demonstrates family commitment."
          }
        },
        {
          id: "d10_s1_encourage",
          text: "Encourage him to retake the exam",
          consequences: {
            emotion: 5,
            karma: 8,
            stress: 5,
            description: "Provided encouragement for persistence. Supportive but brother may need more comprehensive help."
          }
        }
      ]
    },
    {
      id: "d10_business_1",
      day: 10,
      question: "An international client offers you a ₹15 lakh contract to develop their entire digital platform. Work would require 6 months part-time but has great portfolio value.",
      category: "business",
      options: [
        {
          id: "d10_b1_accept",
          text: "Accept the ₹15L international contract",
          consequences: {
            financial: 1500000,
            stress: 30,
            energy: -20,
            reputation: 20,
            description: "Major ₹15L contract accepted. Excellent income and reputation boost but intense workload ahead."
          }
        },
        {
          id: "d10_b1_team",
          text: "Accept but hire a team to help",
          consequences: {
            financial: 750000,
            stress: 15,
            logic: 15,
            reputation: 15,
            description: "Smart delegation strategy. ₹7.5L net profit while building team management experience."
          }
        },
        {
          id: "d10_b1_decline",
          text: "Decline to focus on current priorities",
          consequences: {
            energy: 10,
            emotion: -8,
            reputation: -5,
            description: "Preserved work-life balance but missed significant income and international exposure opportunity."
          }
        }
      ]
    },
    {
      id: "d10_lifestyle_1",
      day: 10,
      question: "You're invited to an exclusive wealth management seminar in Switzerland. Cost is ₹2.5 lakhs but attendees include billionaire investors and thought leaders.",
      category: "lifestyle",
      options: [
        {
          id: "d10_l1_attend",
          text: "Attend the Switzerland seminar",
          consequences: {
            financial: -250000,
            stress: 8,
            reputation: 15,
            logic: 12,
            description: "₹2.5L investment in high-level networking. Expensive but potential for transformative connections."
          }
        },
        {
          id: "d10_l1_local",
          text: "Find similar local networking events",
          consequences: {
            financial: -25000,
            logic: 10,
            energy: -5,
            description: "Cost-effective ₹25K local networking. Saved money but may lack the exclusive access and global perspective."
          }
        },
        {
          id: "d10_l1_skip",
          text: "Focus on building wealth first",
          consequences: {
            logic: 8,
            energy: 5,
            emotion: -5,
            description: "Prioritized wealth building over networking. Practical but potentially missed game-changing connections."
          }
        }
      ]
    },
    {
      id: "d10_relationships_1",
      day: 10,
      question: "Your best friend Kavya announces her engagement and asks you to be her wedding planner. It's a honor but would consume your next 3 months.",
      category: "relationships",
      options: [
        {
          id: "d10_rel1_accept",
          text: "Accept the wedding planning responsibility",
          consequences: {
            emotion: 20,
            karma: 25,
            energy: -25,
            stress: 20,
            description: "Honored Kavya's request despite personal cost. Deepened friendship but significant time and energy commitment."
          }
        },
        {
          id: "d10_rel1_partial",
          text: "Offer to help with specific aspects only",
          consequences: {
            emotion: 10,
            karma: 12,
            energy: -8,
            description: "Balanced friendship support with personal boundaries. Helpful but Kavya may have wanted full commitment."
          }
        },
        {
          id: "d10_rel1_decline",
          text: "Suggest hiring a professional planner",
          consequences: {
            emotion: -8,
            karma: -10,
            stress: 5,
            description: "Protected personal time but disappointed best friend during important life milestone."
          }
        }
      ]
    }
  ],

  // FAST FOOD SECTOR DECISIONS (Days 11-20)
  11: [
    {
      id: "d11_fast_food_1",
      day: 11,
      question: "Your fast food franchise reports customer complaints about food quality. You can upgrade ingredients (+₹50K monthly cost) or improve training (+₹25K monthly cost).",
      category: "business",
      sector: "fast_food",
      options: [
        {
          id: "d11_ff1_ingredients",
          text: "Upgrade to premium ingredients",
          consequences: {
            financial: -50000,
            reputation: 15,
            stress: 5,
            description: "Invested in premium ingredients. Customer satisfaction up but monthly costs increased by ₹50K."
          }
        },
        {
          id: "d11_ff1_training",
          text: "Improve staff training programs",
          consequences: {
            financial: -25000,
            logic: 10,
            energy: 5,
            description: "Enhanced staff training. Better service quality with ₹25K monthly investment."
          }
        },
        {
          id: "d11_ff1_ignore",
          text: "Maintain current standards to save costs",
          consequences: {
            reputation: -10,
            stress: 15,
            emotion: -5,
            description: "Ignored quality concerns. Short-term savings but customer dissatisfaction growing."
          }
        }
      ]
    },
    {
      id: "d11_fast_food_2",
      day: 11,
      question: "A competitor opens a similar restaurant nearby. You can start a price war, launch aggressive marketing, or focus on unique menu items.",
      category: "business",
      sector: "fast_food",
      options: [
        {
          id: "d11_ff2_price",
          text: "Start competitive pricing strategy",
          consequences: {
            financial: -30000,
            stress: 20,
            logic: 8,
            description: "Reduced prices to compete. Market share maintained but profit margins squeezed by ₹30K monthly."
          }
        },
        {
          id: "d11_ff2_marketing",
          text: "Launch aggressive marketing campaign",
          consequences: {
            financial: -75000,
            reputation: 12,
            energy: -10,
            description: "Heavy marketing spend of ₹75K. Brand visibility increased but significant cash outflow."
          }
        },
        {
          id: "d11_ff2_unique",
          text: "Develop unique signature dishes",
          consequences: {
            financial: -40000,
            logic: 15,
            emotion: 10,
            description: "Invested ₹40K in menu innovation. Differentiated offering but development costs incurred."
          }
        }
      ]
    },
    {
      id: "d11_fast_food_3",
      day: 11,
      question: "Your fast food chain has opportunity to cater a large corporate event for ₹2L, but it requires hiring temporary staff and overtime costs.",
      category: "business",
      sector: "fast_food",
      options: [
        {
          id: "d11_ff3_accept",
          text: "Accept the catering contract",
          consequences: {
            financial: 150000,
            stress: 15,
            reputation: 8,
            description: "Secured ₹2L catering deal. Net profit ₹1.5L after costs but operational stress from large order."
          }
        },
        {
          id: "d11_ff3_decline",
          text: "Decline to maintain quality standards",
          consequences: {
            emotion: -5,
            stress: -5,
            logic: 10,
            description: "Prioritized quality over quick revenue. Missed ₹1.5L opportunity but maintained operational stability."
          }
        }
      ]
    }
  ],

  12: [
    {
      id: "d12_tech_1",
      day: 12,
      question: "Your tech startup's app has a critical security vulnerability. You can hire emergency contractors for ₹3L or delay launch for internal fix.",
      category: "technology",
      sector: "tech_startups",
      options: [
        {
          id: "d12_t1_contractors",
          text: "Hire emergency security contractors",
          consequences: {
            financial: -300000,
            stress: 10,
            reputation: 5,
            description: "Quickly resolved security issue with ₹3L contractor spend. Launch on track but major expense."
          }
        },
        {
          id: "d12_t1_delay",
          text: "Delay launch for internal security fix",
          consequences: {
            stress: 20,
            logic: 15,
            emotion: -10,
            description: "Delayed launch by 3 months for proper security. Missed market window but saved ₹3L in costs."
          }
        },
        {
          id: "d12_t1_minimal",
          text: "Launch with minimal viable security patch",
          consequences: {
            stress: 25,
            reputation: -15,
            description: "Rushed launch with basic security fix. Market entry achieved but reputation at risk from potential breaches."
          }
        }
      ]
    },
    {
      id: "d12_tech_2",
      day: 12,
      question: "A major tech company offers to acquire your startup for ₹5 crores, but you believe it could be worth ₹10 crores in 2 years.",
      category: "business",
      sector: "tech_startups",
      options: [
        {
          id: "d12_t2_accept",
          text: "Accept the ₹5 crore acquisition offer",
          consequences: {
            financial: 50000000,
            emotion: 10,
            stress: -20,
            description: "Sold startup for ₹5 crores. Immediate wealth but missed potential for higher valuation."
          }
        },
        {
          id: "d12_t2_counter",
          text: "Counter with ₹7 crore valuation",
          consequences: {
            stress: 15,
            logic: 12,
            reputation: 5,
            description: "Negotiated higher valuation. Shows confidence in startup value but risk of losing deal entirely."
          }
        },
        {
          id: "d12_t2_reject",
          text: "Reject and continue building the company",
          consequences: {
            stress: 30,
            energy: 15,
            emotion: 20,
            description: "Bet on long-term vision over immediate exit. High stress but potential for ₹10 crore+ valuation."
          }
        }
      ]
    }
  ],

  13: [
    {
      id: "d13_ecommerce_1",
      day: 13,
      question: "Your e-commerce platform faces payment gateway issues during peak shopping season. You can switch providers (₹2L cost) or offer manual payment options.",
      category: "technology",
      sector: "ecommerce",
      options: [
        {
          id: "d13_ec1_switch",
          text: "Switch to premium payment gateway",
          consequences: {
            financial: -200000,
            stress: 15,
            reputation: 10,
            description: "Invested ₹2L in reliable payment system. Customer experience improved but significant cost during peak season."
          }
        },
        {
          id: "d13_ec1_manual",
          text: "Implement manual payment verification system",
          consequences: {
            stress: 25,
            energy: -15,
            logic: 8,
            description: "Created workaround with manual processing. Saved ₹2L but increased operational complexity and stress."
          }
        },
        {
          id: "d13_ec1_wait",
          text: "Wait for current provider to fix issues",
          consequences: {
            reputation: -20,
            financial: -500000,
            stress: 30,
            description: "Lost ₹5L in sales during payment outage. Damaged customer trust during critical shopping period."
          }
        }
      ]
    },
    {
      id: "d13_ecommerce_2",
      day: 13,
      question: "Major international brand wants to sell exclusively on your platform, but demands 50% revenue share and front-page placement.",
      category: "partnership",
      sector: "ecommerce",
      options: [
        {
          id: "d13_ec2_accept",
          text: "Accept the exclusive partnership deal",
          consequences: {
            financial: 1000000,
            reputation: 15,
            stress: 10,
            description: "Secured major brand partnership. ₹10L monthly revenue boost but high revenue sharing cost."
          }
        },
        {
          id: "d13_ec2_negotiate",
          text: "Negotiate for 35% revenue share",
          consequences: {
            logic: 15,
            stress: 15,
            karma: -5,
            description: "Pushed for better terms. Potentially better deal but risk of losing prestigious brand partnership."
          }
        },
        {
          id: "d13_ec2_decline",
          text: "Decline and maintain platform independence",
          consequences: {
            emotion: -10,
            logic: 10,
            energy: 5,
            description: "Preserved platform autonomy but missed major revenue opportunity with international brand."
          }
        }
      ]
    }
  ],

  14: [
    {
      id: "d14_healthcare_1",
      day: 14,
      question: "Your healthcare platform faces regulatory compliance issues. You can hire legal consultants (₹8L) or delay operations for 6 months to fix internally.",
      category: "business",
      sector: "healthcare",
      options: [
        {
          id: "d14_hc1_legal",
          text: "Hire specialized legal consultants",
          consequences: {
            financial: -800000,
            stress: 10,
            reputation: 15,
            description: "Invested ₹8L in compliance experts. Operations can continue with proper legal framework in place."
          }
        },
        {
          id: "d14_hc1_delay",
          text: "Delay operations for internal compliance fix",
          consequences: {
            stress: 30,
            emotion: -15,
            logic: 12,
            description: "Halted operations for 6 months. Significant delay but saved ₹8L in legal costs."
          }
        },
        {
          id: "d14_hc1_minimal",
          text: "Implement minimal compliance measures",
          consequences: {
            stress: 35,
            reputation: -25,
            description: "Continued with basic compliance. High risk of regulatory penalties and reputation damage."
          }
        }
      ]
    },
    {
      id: "d14_healthcare_2",
      day: 14,
      question: "Top medical specialist wants to join your platform but demands exclusive contract and ₹5L monthly guarantee.",
      category: "partnership",
      sector: "healthcare",
      options: [
        {
          id: "d14_hc2_accept",
          text: "Accept exclusive specialist contract",
          consequences: {
            financial: -500000,
            reputation: 20,
            stress: 15,
            description: "Secured renowned specialist with ₹5L monthly commitment. Enhanced credibility but significant fixed cost."
          }
        },
        {
          id: "d14_hc2_revenue_share",
          text: "Propose revenue-sharing model instead",
          consequences: {
            logic: 18,
            stress: 10,
            karma: 5,
            description: "Negotiated performance-based compensation. Lower fixed costs but specialist may prefer guaranteed income."
          }
        },
        {
          id: "d14_hc2_decline",
          text: "Decline and find other specialists",
          consequences: {
            emotion: -8,
            energy: -5,
            description: "Missed opportunity with top specialist but maintained flexible cost structure."
          }
        }
      ]
    }
  ],

  // Adding more days with varying sector decisions (Days 15-25)
  15: [
    {
      id: "d15_ff_supply",
      day: 15,
      question: "Your fast food supplier offers 20% discount for yearly contract worth ₹12L, but requires upfront payment of ₹8L.",
      category: "business",
      sector: "fast_food",
      options: [
        {
          id: "d15_ff_contract",
          text: "Sign yearly supply contract",
          consequences: {
            financial: -800000,
            logic: 15,
            stress: 8,
            description: "Locked in ₹2.4L annual savings with ₹8L upfront payment. Good economics but cash flow impact."
          }
        },
        {
          id: "d15_ff_monthly",
          text: "Continue monthly supply agreements",
          consequences: {
            financial: -240000,
            energy: 5,
            stress: -5,
            description: "Maintained cash flow flexibility but missed ₹2.4L annual savings opportunity."
          }
        }
      ]
    },
    {
      id: "d15_tech_hiring",
      day: 15,
      question: "Senior developer from Google wants to join your startup for 2% equity + ₹25L salary. Current team members might demand equity too.",
      category: "business",
      sector: "tech_startups",
      options: [
        {
          id: "d15_tech_hire",
          text: "Hire Google developer with equity deal",
          consequences: {
            financial: -2500000,
            reputation: 15,
            stress: 20,
            description: "Acquired top talent but ₹25L salary + equity dilution may create team compensation issues."
          }
        },
        {
          id: "d15_tech_negotiate",
          text: "Negotiate lower equity with performance bonus",
          consequences: {
            logic: 12,
            stress: 15,
            karma: 5,
            description: "Structured competitive offer with performance incentives. Balances cost with talent acquisition."
          }
        },
        {
          id: "d15_tech_decline",
          text: "Continue with current team",
          consequences: {
            emotion: -5,
            energy: 8,
            stress: -10,
            description: "Avoided compensation inflation but missed opportunity to add Google-level expertise."
          }
        }
      ]
    }
  ],

  // Continue with more sector-specific decisions across days 16-50
  16: [
    {
      id: "d16_ecom_warehouse",
      day: 16,
      question: "Your e-commerce growth requires new warehouse. You can lease for ₹3L monthly or buy for ₹2 crores with loan.",
      category: "real_estate",
      sector: "ecommerce",
      options: [
        {
          id: "d16_ec_lease",
          text: "Lease warehouse for ₹3L monthly",
          consequences: {
            financial: -300000,
            energy: 8,
            stress: 5,
            description: "Flexible warehouse solution with ₹3L monthly cost. Lower commitment but higher long-term cost."
          }
        },
        {
          id: "d16_ec_buy",
          text: "Purchase warehouse with ₹2 crore loan",
          consequences: {
            financial: -20000000,
            stress: 30,
            logic: 12,
            description: "Major ₹2 crore investment in owned warehouse. Long-term savings but huge financial commitment."
          }
        },
        {
          id: "d16_ec_3pl",
          text: "Use third-party logistics provider",
          consequences: {
            financial: -150000,
            energy: 12,
            stress: -8,
            description: "Outsourced warehousing for ₹1.5L monthly. Lowest cost and complexity but less control."
          }
        }
      ]
    }
  ],

  17: [
    {
      id: "d17_healthcare_expansion",
      day: 17,
      question: "Government offers healthcare platform partnership for rural areas. ₹50L funding but requires serving low-income patients.",
      category: "partnership",
      sector: "healthcare",
      options: [
        {
          id: "d17_hc_accept",
          text: "Accept government rural healthcare partnership",
          consequences: {
            financial: 5000000,
            karma: 25,
            stress: 20,
            description: "Secured ₹50L government funding for rural expansion. Social impact but complex operational challenges."
          }
        },
        {
          id: "d17_hc_urban",
          text: "Focus on urban premium healthcare market",
          consequences: {
            financial: 3000000,
            logic: 15,
            emotion: -8,
            description: "Concentrated on profitable urban market. ₹30L revenue potential but missed social impact opportunity."
          }
        }
      ]
    }
  ],

  // Continuing with more days up to day 50+
  18: [
    {
      id: "d18_ff_franchise",
      day: 18,
      question: "Successful businessman offers ₹25L for fast food franchise rights in another city. You keep 30% ownership and operational control.",
      category: "partnership",
      sector: "fast_food",
      options: [
        {
          id: "d18_ff_franchise",
          text: "Accept franchise partnership deal",
          consequences: {
            financial: 2500000,
            stress: 15,
            reputation: 12,
            description: "Expanded to new city with ₹25L investment. Rapid growth but increased management complexity."
          }
        },
        {
          id: "d18_ff_own",
          text: "Save money to open company-owned outlet",
          consequences: {
            logic: 18,
            stress: 8,
            energy: -5,
            description: "Chose slower self-funded expansion. Better control and margins but delayed growth opportunity."
          }
        }
      ]
    }
  ],

  19: [
    {
      id: "d19_tech_patent",
      day: 19,
      question: "Your startup's algorithm might infringe on competitor's patent. You can license for ₹15L, redesign for 6 months, or risk legal battle.",
      category: "technology",
      sector: "tech_startups",
      options: [
        {
          id: "d19_tech_license",
          text: "Purchase patent license",
          consequences: {
            financial: -1500000,
            stress: 5,
            reputation: 8,
            description: "Secured legal protection with ₹15L license fee. Safe approach but significant IP cost."
          }
        },
        {
          id: "d19_tech_redesign",
          text: "Redesign algorithm to avoid infringement",
          consequences: {
            stress: 25,
            logic: 20,
            energy: -15,
            description: "6-month redesign project to avoid patent issues. Innovation forced but delayed product launch."
          }
        },
        {
          id: "d19_tech_risk",
          text: "Continue with current algorithm",
          consequences: {
            stress: 35,
            reputation: -15,
            description: "Risked patent litigation to maintain timeline. Potential legal costs could exceed ₹50L."
          }
        }
      ]
    }
  ],

  20: [
    {
      id: "d20_ecom_international",
      day: 20,
      question: "International shipping company offers global expansion partnership. ₹1 crore setup cost but access to 50+ countries.",
      category: "partnership",
      sector: "ecommerce",
      options: [
        {
          id: "d20_ec_global",
          text: "Accept international expansion partnership",
          consequences: {
            financial: -10000000,
            stress: 30,
            reputation: 20,
            description: "Massive ₹1 crore investment for global reach. Huge potential but significant financial commitment."
          }
        },
        {
          id: "d20_ec_regional",
          text: "Start with neighboring countries first",
          consequences: {
            financial: -2000000,
            logic: 18,
            stress: 15,
            description: "Gradual expansion with ₹20L investment. Lower risk approach but missed comprehensive global deal."
          }
        },
        {
          id: "d20_ec_domestic",
          text: "Focus on strengthening domestic market",
          consequences: {
            energy: 10,
            stress: -10,
            emotion: -5,
            description: "Concentrated on local market dominance. Missed international opportunity but maintained focus."
          }
        }
      ]
    }
  ],

  // Continue with extensive sector-specific decisions (Days 21-50+)
  21: [
    {
      id: "d21_ff_automation",
      day: 21,
      question: "Kitchen automation system costs ₹8L but reduces staff costs by ₹30K monthly. ROI in 27 months.",
      category: "technology",
      sector: "fast_food",
      options: [
        {
          id: "d21_ff_automate",
          text: "Install kitchen automation system",
          consequences: {
            financial: -800000,
            logic: 20,
            stress: 15,
            description: "₹8L automation investment. Long-term savings of ₹30K monthly but high upfront cost."
          }
        },
        {
          id: "d21_ff_manual",
          text: "Continue with manual operations",
          consequences: {
            financial: -30000,
            energy: -10,
            stress: 8,
            description: "Maintained current operations with ₹30K monthly staff costs but avoided major investment."
          }
        }
      ]
    }
  ],

  22: [
    {
      id: "d22_tech_ai",
      day: 22,
      question: "AI company offers white-label solution for ₹20L that could enhance your app's capabilities significantly.",
      category: "technology",
      sector: "tech_startups",
      options: [
        {
          id: "d22_tech_ai_buy",
          text: "Purchase AI white-label solution",
          consequences: {
            financial: -2000000,
            reputation: 18,
            stress: 12,
            description: "₹20L AI integration. Cutting-edge features but massive development cost."
          }
        },
        {
          id: "d22_tech_ai_build",
          text: "Build in-house AI capabilities",
          consequences: {
            financial: -500000,
            stress: 25,
            logic: 15,
            description: "₹5L in-house AI development. Slower progress but proprietary technology and learning."
          }
        }
      ]
    }
  ],

  23: [
    {
      id: "d23_ecom_mobile",
      day: 23,
      question: "Mobile app development needed. Outsource for ₹12L in 3 months or build in-house team for ₹25L over 8 months.",
      category: "technology",
      sector: "ecommerce",
      options: [
        {
          id: "d23_ec_outsource",
          text: "Outsource mobile app development",
          consequences: {
            financial: -1200000,
            stress: 10,
            energy: 8,
            description: "₹12L outsourced app in 3 months. Fast market entry but external dependency."
          }
        },
        {
          id: "d23_ec_inhouse",
          text: "Build in-house mobile development team",
          consequences: {
            financial: -2500000,
            logic: 22,
            stress: 20,
            description: "₹25L in-house team over 8 months. Higher cost and slower but internal capability building."
          }
        }
      ]
    }
  ],

  24: [
    {
      id: "d24_hc_insurance",
      day: 24,
      question: "Major insurance company wants partnership covering 1M+ members. ₹1 crore revenue potential but strict compliance requirements.",
      category: "partnership",
      sector: "healthcare",
      options: [
        {
          id: "d24_hc_partner",
          text: "Accept insurance partnership",
          consequences: {
            financial: 10000000,
            stress: 30,
            reputation: 25,
            description: "₹1 crore insurance deal. Massive scale but complex regulatory compliance requirements."
          }
        },
        {
          id: "d24_hc_small",
          text: "Start with smaller insurance providers",
          consequences: {
            financial: 2000000,
            logic: 18,
            stress: 15,
            description: "₹20L from smaller partnerships. Lower revenue but manageable compliance complexity."
          }
        }
      ]
    }
  ],

  // Days 25-30: Advanced sector decisions
  25: [
    {
      id: "d25_ff_delivery",
      day: 25,
      question: "Food delivery apps charge 25% commission. Build own delivery system for ₹15L or continue paying high commissions.",
      category: "business",
      sector: "fast_food",
      options: [
        {
          id: "d25_ff_own_delivery",
          text: "Build proprietary delivery system",
          consequences: {
            financial: -1500000,
            logic: 25,
            stress: 22,
            description: "₹15L delivery system investment. Long-term savings from avoiding 25% commissions."
          }
        },
        {
          id: "d25_ff_continue",
          text: "Continue with existing delivery partners",
          consequences: {
            financial: -100000,
            energy: 8,
            stress: 5,
            description: "Maintained ₹1L monthly commission costs but avoided major system development."
          }
        }
      ]
    }
  ],

  26: [
    {
      id: "d26_tech_scale",
      day: 26,
      question: "User base growing 300% monthly. Upgrade server infrastructure for ₹30L or risk platform crashes during peak usage.",
      category: "technology",
      sector: "tech_startups",
      options: [
        {
          id: "d26_tech_upgrade",
          text: "Invest in enterprise server infrastructure",
          consequences: {
            financial: -3000000,
            stress: 15,
            reputation: 12,
            description: "₹30L infrastructure investment. Platform stability ensured but major capital requirement."
          }
        },
        {
          id: "d26_tech_risk",
          text: "Optimize existing systems and hope for the best",
          consequences: {
            stress: 35,
            reputation: -20,
            financial: -500000,
            description: "Risked platform stability. ₹5L lost revenue from crashes during peak usage."
          }
        }
      ]
    }
  ],

  // Continue through day 50+ with sector mix
  30: [
    {
      id: "d30_multi_sector",
      day: 30,
      question: "Angel investor offers ₹2 crore for expanding into second business sector. Which sector should you prioritize?",
      category: "business",
      sector: "general",
      options: [
        {
          id: "d30_expand_tech",
          text: "Expand into tech startups",
          consequences: {
            financial: 20000000,
            stress: 25,
            logic: 20,
            description: "₹2 crore funding for tech expansion. High growth potential but competitive market."
          }
        },
        {
          id: "d30_expand_health",
          text: "Enter healthcare sector",
          consequences: {
            financial: 20000000,
            stress: 30,
            karma: 20,
            description: "₹2 crore for healthcare entry. Social impact potential but regulatory challenges."
          }
        },
        {
          id: "d30_focus",
          text: "Focus on current sector instead",
          consequences: {
            logic: 15,
            stress: -10,
            emotion: -8,
            description: "Avoided diversification to master current business. Missed expansion opportunity."
          }
        }
      ]
    }
  ],

  // Days 35-50: Complex multi-sector scenarios
  35: [
    {
      id: "d35_acquisition",
      day: 35,
      question: "Struggling competitor in your sector wants to sell for ₹1.5 crore. Good customer base but operational issues.",
      category: "business",
      sector: "general",
      options: [
        {
          id: "d35_acquire",
          text: "Acquire competitor",
          consequences: {
            financial: -15000000,
            stress: 25,
            reputation: 15,
            description: "₹1.5 crore acquisition. Market consolidation but integration challenges ahead."
          }
        },
        {
          id: "d35_pass",
          text: "Let competitor fail naturally",
          consequences: {
            logic: 12,
            karma: -10,
            emotion: -5,
            description: "Avoided acquisition risk but missed opportunity to gain market share."
          }
        }
      ]
    }
  ],

  40: [
    {
      id: "d40_ipo",
      day: 40,
      question: "Investment bank suggests IPO preparation. ₹50L process cost but potential ₹10+ crore valuation.",
      category: "investment",
      sector: "general",
      options: [
        {
          id: "d40_ipo_prep",
          text: "Begin IPO preparation process",
          consequences: {
            financial: -5000000,
            stress: 35,
            reputation: 30,
            description: "₹50L IPO preparation. Potential massive exit but 18-month process with high stress."
          }
        },
        {
          id: "d40_private",
          text: "Stay private and seek strategic investors",
          consequences: {
            financial: 30000000,
            logic: 20,
            stress: 15,
            description: "₹3 crore private investment. Maintained control but lower valuation than IPO potential."
          }
        }
      ]
    }
  ],

  45: [
    {
      id: "d45_international",
      day: 45,
      question: "International expansion opportunity in Southeast Asia. ₹5 crore investment for 3-country launch.",
      category: "business",
      sector: "general",
      options: [
        {
          id: "d45_expand",
          text: "Launch international expansion",
          consequences: {
            financial: -50000000,
            stress: 40,
            reputation: 25,
            description: "₹5 crore international expansion. Huge market potential but massive operational complexity."
          }
        },
        {
          id: "d45_domestic",
          text: "Perfect domestic market first",
          consequences: {
            logic: 25,
            stress: -15,
            emotion: -10,
            description: "Focused on domestic excellence. Missed international opportunity but reduced complexity."
          }
        }
      ]
    }
  ],

  50: [
    {
      id: "d50_exit",
      day: 50,
      question: "Major corporation offers ₹50 crore acquisition. Life-changing money but end of entrepreneurial journey.",
      category: "business",
      sector: "general",
      options: [
        {
          id: "d50_sell",
          text: "Accept the acquisition offer",
          consequences: {
            financial: 500000000,
            emotion: 15,
            stress: -30,
            description: "₹50 crore exit achieved. Financial freedom but end of building the company dream."
          }
        },
        {
          id: "d50_continue",
          text: "Continue building the empire",
          consequences: {
            stress: 20,
            emotion: 25,
            energy: 20,
            description: "Rejected exit for bigger vision. Entrepreneurial spirit intact but missed guaranteed wealth."
          }
        }
      ]
    }
  ]
};

// Function to get decisions for a specific day based on purchased sectors
export function getDecisionsForDay(day: number, purchasedSectors: string[] = []): Decision[] {
  const dayDecisions = DAILY_DECISIONS[day] || [];
  
  // Filter decisions based on purchased sectors
  const relevantDecisions = dayDecisions.filter(decision => {
    // Always include general decisions
    if (!decision.sector || decision.sector === 'general') {
      return true;
    }
    
    // Include sector-specific decisions only if user has purchased that sector
    return purchasedSectors.includes(decision.sector);
  });
  
  if (day <= 3) {
    // Days 1-3 have fixed counts, return all relevant decisions
    return relevantDecisions;
  } else if (day >= 4) {
    // Days 4+ have random 3-4 decisions from available pool
    const minDecisions = 3;
    const maxDecisions = Math.min(4, relevantDecisions.length);
    const numDecisions = Math.floor(Math.random() * (maxDecisions - minDecisions + 1)) + minDecisions;
    
    // Shuffle and take random subset
    const shuffled = [...relevantDecisions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(numDecisions, relevantDecisions.length));
  }
  
  return [];
}

// Calculate decision counts by day (for validation)
export function getDecisionCountsForDay(day: number): number {
  if (day === 1 || day === 3) return 2;
  if (day === 2) return 3;
  if (day >= 4) {
    // Random 3-4 decisions for days 4+ as requested
    return Math.floor(Math.random() * 2) + 3; // 3-4 decisions
  }
  return 0;
}

// Get all available sectors from decisions
export function getAvailableSectors(): string[] {
  return ['fast_food', 'tech_startups', 'ecommerce', 'healthcare'];
}

// Get decisions count by sector (for analytics)
export function getDecisionsBySector(sector: string): Decision[] {
  const allDecisions: Decision[] = [];
  Object.values(DAILY_DECISIONS).forEach(dayDecisions => {
    allDecisions.push(...dayDecisions.filter(d => d.sector === sector));
  });
  return allDecisions;
}