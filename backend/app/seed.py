from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app import models, auth
from app.config import settings

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        db.query(models.User).delete()
        db.query(models.Profile).delete()
        db.query(models.Skill).delete()
        db.query(models.Experience).delete()
        db.query(models.Project).delete()
        db.query(models.Education).delete()
        db.query(models.Setting).delete()
        db.commit()

        # Seed admin user
        admin_user = models.User(
            email=settings.ADMIN_EMAIL,
            hashed_password=auth.hash_password(settings.ADMIN_PASSWORD)
        )
        db.add(admin_user)

        # Seed profile
        profile = models.Profile(
            name="Vijay Bhesaniya",
            taglines=[
                "Shopify Liquid Developer",
                "Python Developer",
                "WordPress Developer",
                "eCommerce Performance Specialist"
            ],
            intro_text="Results-driven Shopify Liquid, Python, and WordPress Developer with 2+ years of experience building high-converting eCommerce storefronts, internal business systems, and content-managed websites.",
            about_text="Results-driven Shopify Liquid, Python, and WordPress Developer with 2+ years of experience building custom, high-converting eCommerce storefronts, internal business systems, and content-managed websites. Skilled in Liquid templating, Python application development, custom theme development, Shopify app/API integrations, headless CMS (Contentful), React front ends, and performance optimization (page speed, SEO, mobile-first UX). Delivered 15+ live Shopify, WordPress, and Python-based projects for clients across India, the UK, US, Canada, and Ireland, including a zero-downtime WooCommerce-to-Shopify migration and in-house HRMS/BMS platforms.",
            location="Ahmedabad, Gujarat, India",
            experience_years="2+ years",
            projects_delivered=17,
            education_summary="B.E. Computer Engineering",
            email="bhesaniyav38@gmail.com",
            phone="9510426764",
            linkedin_url="https://linkedin.com/in/bhesaniya-vijay-355b7020b",
            github_url="https://vijaybhesaniya.github.io/portfolio"
        )
        db.add(profile)

        # Seed settings
        site_settings = models.Setting(
            default_theme="dark",
            seo_title="Vijay Bhesaniya | Shopify & Python Developer Portfolio",
            seo_description="Personal portfolio of Vijay Bhesaniya, Shopify Liquid, Python, and WordPress Developer with 2+ years of experience building eCommerce storefronts and internal business systems."
        )
        db.add(site_settings)

        # Seed skills
        skills_data = [
            # Shopify & eCommerce
            ("Shopify & eCommerce", "Shopify Liquid Development", 1),
            ("Shopify & eCommerce", "Custom Theme Design & Sections", 2),
            ("Shopify & eCommerce", "Shopify CLI & App Development", 3),
            ("Shopify & eCommerce", "Shopify API & Third-Party Integrations", 4),
            ("Shopify & eCommerce", "WooCommerce-to-Shopify Migration", 5),
            ("Shopify & eCommerce", "A/B Testing & Conversion Optimization", 6),
            # Web Development
            ("Web Development", "WordPress Development (PHP)", 1),
            ("Web Development", "HTML5", 2),
            ("Web Development", "CSS3", 3),
            ("Web Development", "JavaScript", 4),
            ("Web Development", "Bootstrap", 5),
            ("Web Development", "React", 6),
            ("Web Development", "Contentful (Headless CMS)", 7),
            # Backend / Python
            ("Backend / Python", "Python Application Development", 1),
            ("Backend / Python", "HRMS/BMS System Design", 2),
            ("Backend / Python", "Data-driven Analytics Apps", 3),
            # Performance & SEO
            ("Performance & SEO", "Website Speed & Performance Optimization", 1),
            ("Performance & SEO", "SEO & Schema Markup", 2),
            ("Performance & SEO", "Cross-Browser QA & Debugging", 3),
            ("Performance & SEO", "Responsive / Mobile-First Design", 4)
        ]
        for cat, name, order in skills_data:
            db.add(models.Skill(category=cat, name=name, sort_order=order))

        # Seed experiences
        experiences_data = [
            models.Experience(
                title="Shopify & Python Developer",
                company="Trilok Ninfotech Pvt. Ltd.",
                location="Ahmedabad, India",
                start_date="Sep 2025",
                end_date="Present",
                bullets=[
                    "Designing and building an in-house HRMS (Human Resource Management System) in Python to streamline employee data, attendance, and workflow management.",
                    "Developing a BMS (Business Management System) in Python to centralize core business operations and reporting.",
                    "Building a Shopify analytics application in Python to surface store performance, sales, and product insights.",
                    "Leading 2–3 parallel Python-based projects end-to-end, from requirements gathering through deployment and support.",
                    "Continuing to apply Shopify Liquid expertise on client storefront work alongside backend Python development."
                ],
                sort_order=1
            ),
            models.Experience(
                title="Shopify Developer",
                company="Ecodesoft Solutions",
                location="Ahmedabad, India",
                start_date="Dec 2023",
                end_date="Aug 2025",
                bullets=[
                    "Built and customized 10+ Shopify themes aligned to client branding and UX/UI best practices.",
                    "Integrated third-party apps and APIs (payment gateways, CRM, inventory tools) and built custom Shopify apps with Shopify CLI and Liquid.",
                    "Improved website speed and Core Web Vitals through code refactoring, lazy loading, and image optimization.",
                    "Led a zero-downtime migration of a legacy WooCommerce store to Shopify with minimal SEO impact.",
                    "Implemented SEO best practices, structured schema markup, and A/B testing with analytics integration.",
                    "Provided ongoing store maintenance/support, ensuring 99%+ uptime.",
                    "Mentored junior developers and interns on Liquid templating and clean coding standards."
                ],
                sort_order=2
            ),
            models.Experience(
                title="Shopify Developer — Intern",
                company="Hopiant Pvt. Ltd.",
                location="Junagadh, India",
                start_date="Mar 2023",
                end_date="Dec 2023",
                bullets=[
                    "Designed, developed, and customized Shopify storefronts using Liquid, HTML, CSS, JavaScript, and the Shopify API.",
                    "Collaborated with senior developers and UI/UX designers on responsive, mobile-first eCommerce features.",
                    "Took part in daily stand-ups and sprint planning.",
                    "Performed QA testing/debugging and applied Liquid templating best practices that improved site speed and SEO."
                ],
                sort_order=3
            )
        ]
        for exp in experiences_data:
            db.add(exp)

        # Seed projects
        # Featured project
        db.add(models.Project(
            name="Body of Evidence",
            url="https://www.bodyofevidence.com.au/",
            description="A fast, dynamic web experience built on Contentful headless CMS with a React front end.",
            tech_stack=["Contentful CMS", "React", "Headless Architecture"],
            is_featured=True,
            category="shopify",
            sort_order=1
        ))

        # Standard project grid
        projects_data = [
            ("Trade Vehicle Parts", "https://tradevehicleparts.co.uk/", "Customized theme development, page speed optimization, and responsive design integrations for a UK vehicle parts store.", ["Shopify", "Liquid", "JS"], "shopify"),
            ("Whitaker Brothers", "https://www.whitakerbrothers.com/", "Large-scale eCommerce storefront customization, custom app configurations, and performance debugging.", ["Shopify", "Liquid", "Integrations"], "shopify"),
            ("The Crafty Black Dog", "https://thecraftyblackdog.co.uk/", "A beautiful Shopify store featuring custom sections, third-party payment gateway integration, and A/B testing for sales funnel optimization.", ["Shopify", "Liquid", "CSS"], "shopify"),
            ("Van Junkies", "https://vanjunkies.co.uk/", "Tailored design system implementation, mobile usability tuning, and custom product configuration sections in Shopify.", ["Shopify", "Liquid", "Mobile UX"], "shopify"),
            ("Loxley Arts", "https://loxleyarts.com/", "Art supplies online shop with complex collections mapping, schema markup for Google Search, and page speed refactoring.", ["Shopify", "Liquid", "SEO"], "shopify"),
            ("Alex Davis PCS", "https://alexdavispcs.co.uk/", "Responsive, content-rich WordPress website development focusing on local services promotion and booking workflow.", ["WordPress", "PHP", "CSS"], "wordpress"),
            ("Dervans Fashions", "https://dervansfashions.ie/", "eCommerce store development featuring multi-currency checkout, custom collection layout, and newsletter marketing sync.", ["Shopify", "Liquid", "Marketing APIs"], "shopify"),
            ("The Kennel Store", "https://www.kennelstore.co.uk/", "Fast-loading online storefront for custom dog runs. Set up shipping rules API and mobile navigation widgets.", ["Shopify", "Liquid", "Shipping APIs"], "shopify"),
            ("Mushroom Spawn Store", "https://mushroomspawnstore.com/", "SEO-driven e-commerce setup with automated inventory sync, customized checkout elements, and schema integrations.", ["Shopify", "Liquid", "SEO Optimization"], "shopify"),
            ("Aliver Cosmetics", "https://alivercosmetics.com/", "Cosmetics storefront with rich visuals, optimized images, lazy load setups, and custom checkout upsells.", ["Shopify", "Liquid", "Page Speed"], "shopify"),
            ("All City Candy", "https://allcitycandy.com/", "Complex collection listings, customized product variant swatches, and third-party CRM sync.", ["Shopify", "Liquid", "JS Swatches"], "shopify"),
            ("Gold Label Car Care", "https://www.goldlabelcarcare.co.uk/", "WordPress-based car care store, implementing zero-downtime security patches and custom plugin settings.", ["WordPress", "WooCommerce", "PHP"], "wordpress"),
            ("Healthy Hub", "https://healthyhub.ca/", "A healthy living ecommerce store featuring modern CSS transitions, optimized search, and clean catalog filter structures.", ["Shopify", "Liquid", "UX Design"], "shopify"),
            ("Last Elf on the Left", "https://lastelfontheleft.com/", "Niche holiday product store with high-converting custom sales landing pages and micro-interactions.", ["Shopify", "Liquid", "Framer Motion"], "shopify"),
            ("Signal and Power", "https://www.signalandpower.com/", "Corporate website redesign and migration under WordPress, featuring robust contact inquiry forms and search sorting.", ["WordPress", "PHP", "Bootstrap"], "wordpress"),
            
            # Python Projects to fill the Python category filter nicely
            ("In-House HRMS Platform", "", "An internal Human Resource Management System built to manage employee directories, automated attendance, leave requests, and payroll tracking.", ["Python", "FastAPI", "SQLite", "Tailwind CSS"], "python"),
            ("Business Management System (BMS)", "", "A centralized operations app featuring invoice generation, client tracking dashboard, task lists, and multi-user login controls.", ["Python", "Flask", "PostgreSQL", "Pandas"], "python")
        ]
        
        for idx, (name, url, desc, stack, category) in enumerate(projects_data):
            db.add(models.Project(
                name=name,
                url=url if url else None,
                description=desc,
                tech_stack=stack,
                is_featured=False,
                category=category,
                sort_order=idx + 2
            ))

        # Seed education
        db.add(models.Education(
            institution="Om Engineering College, Junagadh, Gujarat",
            degree="Bachelor of Engineering — Computer Engineering",
            location="Gujarat, India",
            date_range="2019 – 2023",
            sort_order=1
        ))

        db.commit()
        print("Database successfully seeded with default portfolio content!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
