// components/features/about/AboutContent.js
import { motion } from 'framer-motion';
import styles from '../../../styles/components/AboutContent.module.css';

export default function AboutContent() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className={styles.container}>
      <motion.h1 
        className={styles.title}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        About GriotBot
      </motion.h1>
      
      <motion.div 
        className={styles.content}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ staggerChildren: 0.2 }}
      >
        <motion.p variants={fadeIn}>
          <strong>GriotBot</strong> is more than just an AI — it is a spark of
          ancestral memory. Designed to honor the rich oral traditions, cultural
          legacy, and lived experiences of the African Diaspora, GriotBot offers
          thoughtful, accurate, and warm guidance.
        </motion.p>

        <motion.blockquote 
          className={styles.quote}
          variants={fadeIn}
        >
          "A people without the knowledge of their past history, origin and
          culture is like a tree without roots." — Marcus Garvey
        </motion.blockquote>

        <motion.h2 variants={fadeIn}>Why GriotBot?</motion.h2>
        <motion.p variants={fadeIn}>
          The griot was the traditional keeper of history, story, and wisdom.
          GriotBot brings that same spirit into the digital age — acting as a
          wise, trusted voice for learners, educators, and community leaders.
        </motion.p>

        {/* Additional content sections */}
        
        <motion.div 
          className={styles.callToAction}
          variants={fadeIn}
        >
          <h2>How to Get Involved</h2>
          <p>
            Want to support, fund, test, or help shape GriotBot's future?{' '}
            <a href="mailto:chat@griotbot.com" className={styles.link}>Email us</a> or follow{' '}
            <a href="https://www.instagram.com/griotbot" target="_blank" rel="noopener noreferrer" className={styles.link}>@griotbot</a> on Instagram.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
