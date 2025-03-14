const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
	  "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
	  "./src/components/bot/**/*.{astro,html,js,jsx,ts,tsx,css}"
	],
	theme: {
    	container: {
    		center: 'true',
    		padding: '1rem',
    		screens: {
    			'2xl': '1400px'
    		}
    	},
    	extend: {
    		fontFamily: {
    			sans: [
    				'Inter',
                    ...fontFamily.sans
                ],
    			heading: [
    				'CalSans Semibold',
                    ...fontFamily.sans
                ]
    		},
    		marquee: 'marquee var(--duration, 30s) linear infinite',
    		orbit: 'orbit calc(var(--duration)*1s) linear infinite',
    		height: {
    			'18': '4.5rem'
    		},
    		spacing: {
    			'18': '4.5rem'
    		},
    		boxShadow: {
    			stats: '0 -4px 6px -1px rgb(0 0 0 / 0.1), 0 -2px 4px -2px rgb(0 0 0 / 0.1)',
    			sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    			DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    			md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    			lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    			xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    			'2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    			inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    			none: 'none'
    		},
    		colors: {
    			border: 'hsl(var(--border))',
    			input: 'hsl(var(--input))',
    			ring: 'hsl(var(--ring))',
    			background: {
    				'200': 'hsl(var(--background-200))',
    				DEFAULT: 'hsl(var(--background))'
    			},
    			letterSpacing: {
    				wide: '0.7px',
    				wider: '0.025em'
    			},
    			foreground: 'hsl(var(--foreground))',
    			primary: {
    				'50': 'hsl(var(--primary-50))',
    				'100': 'hsl(var(--primary-100))',
    				'200': 'hsl(var(--primary-200))',
    				'300': 'hsl(var(--primary-300))',
    				'400': 'hsl(var(--primary-400))',
    				'500': 'hsl(var(--primary-500))',
    				'600': 'hsl(var(--primary-600))',
    				'900': 'hsl(var(--primary-900))',
    				'950': 'hsl(var(--primary-950))',
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			destructive: {
    				DEFAULT: 'hsl(var(--destructive))',
    				foreground: 'hsl(var(--destructive-foreground))'
    			},
    			muted: {
    				DEFAULT: 'hsl(var(--muted))',
    				foreground: 'hsl(var(--muted-foreground))'
    			},
    			accent: {
    				DEFAULT: 'hsla(var(--accent))',
    				foreground: 'hsl(var(--accent-foreground))'
    			},
    			popover: {
    				DEFAULT: 'hsl(var(--popover))',
    				foreground: 'hsl(var(--popover-foreground))'
    			},
    			card: {
    				DEFAULT: 'hsl(var(--card))',
    				foreground: 'hsl(var(--card-foreground))'
    			},
    			gray: {
    				'100': 'hsl(var(--gray-100))',
    				'200': 'hsl(var(--gray-200))',
    				'400': 'hsl(var(--gray-400))',
    				'500': 'hsl(var(--gray-500))',
    				'600': 'hsl(var(--gray-600))',
    				'800': 'hsl(var(--gray-800))'
    			},
    			green: {
    				'100': 'hsl(var(--green-100))',
    				'300': 'hsl(var(--green-300))',
    				'400': 'hsl(var(--green-400))',
    				'500': 'hsl(var(--green-500))',
    				'800': 'hsl(var(--green-800))'
    			},
    			red: {
    				'100': 'hsl(var(--red-100))',
    				'400': 'hsl(var(--red-400))',
    				'500': 'hsl(var(--red-500))',
    				'600': 'hsl(var(--red-600))',
    				'800': 'hsl(var(--red-800))'
    			},
    			orange: {
    				'100': 'hsl(var(--orange-100))',
    				'400': 'hsl(var(--orange-400))',
    				'800': 'hsl(var(--orange-800))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		keyframes: {
    			orbit: {
    				'0%': {
    					transform: 'rotate(calc(var(--angle) * 1deg)) translateY(calc(var(--radius) * 1px)) rotate(calc(var(--angle) * -1deg))'
    				},
    				'100%': {
    					transform: 'rotate(calc(var(--angle) * 1deg + 360deg)) translateY(calc(var(--radius) * 1px)) rotate(calc((var(--angle) * -1deg) - 360deg))'
    				}
    			},
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			},
    			marquee: {
    				to: {
    					transform: 'translateX(-50%)'
    				}
    			},
    			ripple: {
    				'0%, 100%': {
    					transform: 'translate(-50%, -50%) scale(1)'
    				},
    				'50%': {
    					transform: 'translate(-50%, -50%) scale(0.9)'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out',
    			ripple: 'ripple var(--duration,2s) ease calc(var(--i, 0)*.2s) infinite',
    			orbit: 'orbit calc(var(--duration)*1s) linear infinite'
    		}
    	}
    },
  plugins: [],
};
