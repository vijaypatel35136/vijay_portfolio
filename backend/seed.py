from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
import models
from auth import get_password_hash

def seed_db():
    # Recreate tables
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        # Create Admin
        admin = models.Admin(
            username="admin",
            email="bhesaniyav38@gmail.com",
            hashed_password=get_password_hash("admin123")
        )
        db.add(admin)
        
        # Create Profile
        profile = models.Profile(
            name="Vijay Bhesaniya",
            bio="Results-driven Shopify Liquid, Python, and WordPress Developer with 2+ years of experience building custom, high-converting eCommerce storefronts, internal business systems, and content-managed websites. Skilled in Liquid templating, Python application development, custom theme development, Shopify app/API integrations, headless CMS (Contentful), React front ends, and performance optimization (page speed, SEO, mobile-first UX). Delivered 15+ live Shopify, WordPress, and Python-based projects for clients across India, the UK, US, Canada, and Ireland, including a zero-downtime WooCommerce-to-Shopify migration and in-house HRMS/BMS platforms.",
            typewriter_roles=[
                "Shopify Liquid Developer",
                "Python Developer",
                "WordPress Developer",
                "eCommerce Performance Specialist"
            ],
            phone="9510426764",
            email="bhesaniyav38@gmail.com",
            github="https://github.com/vijaybhesaniya",
            linkedin="https://linkedin.com/in/bhesaniya-vijay-355b7020b",
            address="Ahmedabad, Gujarat, India"
        )
        db.add(profile)
        
        # Create Site Settings
        settings = models.SiteSettings(
            dark_mode_default=True,
            seo_title="Vijay Bhesaniya | Shopify & Python Developer Portfolio",
            seo_description="Personal portfolio website of Vijay Bhesaniya, professional Shopify Liquid & Python Developer specializing in high-performance eCommerce and custom app development.",
            ga_key=""
        )
        db.add(settings)
        
        # Create Skill Categories and Skills
        skills_data = {
            "Shopify & eCommerce": [
                "Shopify Liquid Development",
                "Custom Theme Design & Sections",
                "Shopify CLI & App Development",
                "Shopify API & Third-Party Integrations",
                "WooCommerce-to-Shopify Migration",
                "A/B Testing & Conversion Optimization"
            ],
            "Web Development": [
                "WordPress Development (PHP)",
                "HTML5",
                "CSS3",
                "JavaScript",
                "Bootstrap",
                "React",
                "Contentful (Headless CMS)"
            ],
            "Backend / Python": [
                "Python Application Development",
                "HRMS/BMS System Design",
                "Data-driven Analytics Apps"
            ],
            "Performance & SEO": [
                "Website Speed & Performance Optimization",
                "SEO & Schema Markup",
                "Cross-Browser QA & Debugging",
                "Responsive / Mobile-First Design"
            ]
        }
        
        for cat_order, (cat_name, skill_list) in enumerate(skills_data.items()):
            category = models.SkillCategory(name=cat_name, sort_order=cat_order)
            db.add(category)
            db.flush() # Populate category ID
            
            for skill_order, skill_name in enumerate(skill_list):
                skill = models.Skill(
                    category_id=category.id,
                    name=skill_name,
                    sort_order=skill_order
                )
                db.add(skill)
        
        # Create Experiences
        experiences = [
            models.Experience(
                title="Shopify & Python Developer",
                company="Trilok Ninfotech Pvt. Ltd.",
                location="Ahmedabad, India",
                start_date="Sep 2025",
                end_date="Present",
                points=[
                    "Designing and building an in-house HRMS (Human Resource Management System) in Python to streamline employee data, attendance, and workflow management.",
                    "Developing a BMS (Business Management System) in Python to centralize core business operations and reporting.",
                    "Building a Shopify analytics application in Python to surface store performance, sales, and product insights.",
                    "Leading 2–3 parallel Python-based projects end-to-end, from requirements gathering through deployment and support.",
                    "Continuing to apply Shopify Liquid expertise on client storefront work alongside backend Python development."
                ],
                sort_order=0
            ),
            models.Experience(
                title="Shopify Developer",
                company="Ecodesoft Solutions",
                location="Ahmedabad, India",
                start_date="Dec 2023",
                end_date="Aug 2025",
                points=[
                    "Built and customized 10+ Shopify themes aligned to client branding and UX/UI best practices.",
                    "Integrated third-party apps and APIs (payment gateways, CRM, inventory tools) and built custom Shopify apps with Shopify CLI and Liquid.",
                    "Improved website speed and Core Web Vitals through code refactoring, lazy loading, and image optimization.",
                    "Led a zero-downtime migration of a legacy WooCommerce store to Shopify with minimal SEO impact.",
                    "Implemented SEO best practices, structured schema markup, and A/B testing with analytics integration.",
                    "Provided ongoing store maintenance/support, ensuring 99%+ uptime.",
                    "Mentored junior developers and interns on Liquid templating and clean coding standards."
                ],
                sort_order=1
            ),
            models.Experience(
                title="Shopify Developer — Intern",
                company="Hopiant Pvt. Ltd.",
                location="Junagadh, India",
                start_date="Mar 2023",
                end_date="Dec 2023",
                points=[
                    "Designed, developed, and customized Shopify storefronts using Liquid, HTML, CSS, JavaScript, and the Shopify API.",
                    "Collaborated with senior developers and UI/UX designers on responsive, mobile-first eCommerce features.",
                    "Took part in daily stand-ups and sprint planning.",
                    "Performed QA testing/debugging and applied Liquid templating best practices that improved site speed and SEO."
                ],
                sort_order=2
            )
        ]
        db.add_all(experiences)
        
        # Create Featured Project
        featured_project = models.Project(
            title="Body of Evidence",
            url="https://www.bodyofevidence.com.au/",
            description="A fast, dynamic web experience built on Contentful headless CMS with a React front end.",
            tags=["Contentful CMS", "React", "Headless Architecture"],
            is_featured=True,
            sort_order=0
        )
        db.add(featured_project)
        
        # Create Other Projects
        projects = [
            models.Project(title="Trade Vehicle Parts", url="https://tradevehicleparts.co.uk/", tags=["Shopify"], sort_order=1),
            models.Project(title="Whitaker Brothers", url="https://www.whitakerbrothers.com/", tags=["Shopify"], sort_order=2),
            models.Project(title="The Crafty Black Dog", url="https://thecraftyblackdog.co.uk/", tags=["Shopify"], sort_order=3),
            models.Project(title="Van Junkies", url="https://vanjunkies.co.uk/", tags=["Shopify"], sort_order=4),
            models.Project(title="Loxley Arts", url="https://loxleyarts.com/", tags=["Shopify"], sort_order=5),
            models.Project(title="Alex Davis PCS", url="https://alexdavispcs.co.uk/", tags=["WordPress"], sort_order=6),
            models.Project(title="Dervans Fashions", url="https://dervansfashions.ie/", tags=["Shopify"], sort_order=7),
            models.Project(title="The Kennel Store", url="https://www.kennelstore.co.uk/", tags=["Shopify"], sort_order=8),
            models.Project(title="Mushroom Spawn Store", url="https://mushroomspawnstore.com/", tags=["Shopify"], sort_order=9),
            models.Project(title="Aliver Cosmetics", url="https://alivercosmetics.com/", tags=["Shopify"], sort_order=10),
            models.Project(title="All City Candy", url="https://allcitycandy.com/", tags=["Shopify"], sort_order=11),
            models.Project(title="Gold Label Car Care", url="https://www.goldlabelcarcare.co.uk/", tags=["Shopify"], sort_order=12),
            models.Project(title="Healthy Hub", url="https://healthyhub.ca/", tags=["Shopify"], sort_order=13),
            models.Project(title="Last Elf on the Left", url="https://lastelfontheleft.com/", tags=["Shopify"], sort_order=14),
            models.Project(title="Signal and Power", url="https://www.signalandpower.com/", tags=["WordPress"], sort_order=15),
        ]
        db.add_all(projects)
        
        # Create Education
        education = models.Education(
            institution="Om Engineering College, Junagadh, Gujarat",
            degree="Bachelor of Engineering — Computer Engineering",
            location="Junagadh, Gujarat",
            date_range="2019 – 2023"
        )
        db.add(education)
        
        db.commit()
        print("Database successfully seeded!")
    except Exception as e:
        db.rollback()
        print("Error seeding database:", e)
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
