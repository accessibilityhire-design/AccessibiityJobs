/**
 * Job Description Formatter
 * Converts raw markdown/text job descriptions to clean HTML for display
 */

/**
 * Convert markdown-formatted job description to clean HTML
 */
export function formatJobDescription(text: string | null | undefined): string {
    if (!text) return '<p>No description available.</p>';

    let html = text;

    // First, unescape common escape sequences from JobSpy
    html = html.replace(/\\-/g, '-');
    html = html.replace(/\\\*/g, '*');
    html = html.replace(/\\_/g, '_');
    html = html.replace(/\\n/g, '\n');
    html = html.replace(/\\t/g, '\t');
    html = html.replace(/\\\[/g, '[');
    html = html.replace(/\\\]/g, ']');
    html = html.replace(/\\\(/g, '(');
    html = html.replace(/\\\)/g, ')');

    // Convert markdown to HTML

    // Headers: ## Header -> <h3>Header</h3>
    html = html.replace(/^####\s+(.+)$/gm, '<h5>$1</h5>');
    html = html.replace(/^###\s+(.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^##\s+(.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^#\s+(.+)$/gm, '<h3>$1</h3>');

    // Bold: **text** -> <strong>text</strong>
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic: *text* -> <em>text</em> (but not if it's a bullet point)
    // Only match single asterisks that are surrounded by non-space characters
    html = html.replace(/(\s|^)\*([^\s*][^*]*[^\s*])\*(\s|$)/g, '$1<em>$2</em>$3');

    // Convert bullet points to HTML lists
    // Match lines starting with * or - followed by space
    const lines = html.split('\n');
    const processedLines: string[] = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isBullet = /^[\*\-•]\s+/.test(line.trim());

        if (isBullet) {
            if (!inList) {
                processedLines.push('<ul>');
                inList = true;
            }
            const content = line.trim().replace(/^[\*\-•]\s+/, '');
            processedLines.push(`<li>${content}</li>`);
        } else {
            if (inList) {
                processedLines.push('</ul>');
                inList = false;
            }
            processedLines.push(line);
        }
    }
    if (inList) {
        processedLines.push('</ul>');
    }

    html = processedLines.join('\n');

    // Convert double newlines to paragraphs (but not within lists)
    const sections = html.split(/\n\n+/);
    html = sections.map(section => {
        const trimmed = section.trim();
        // Don't wrap headers, lists, or already-wrapped elements in paragraphs
        if (trimmed.startsWith('<h') ||
            trimmed.startsWith('<ul') ||
            trimmed.startsWith('<ol') ||
            trimmed.startsWith('<li') ||
            trimmed === '</ul>' ||
            trimmed === '') {
            return trimmed;
        }
        return `<p>${trimmed}</p>`;
    }).join('\n');

    // Clean up remaining single newlines within paragraphs as line breaks
    html = html.replace(/<p>([^<]*)\n([^<]*)<\/p>/g, (match, p1, p2) => {
        return `<p>${p1}<br/>${p2}</p>`;
    });

    // Clean up empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, '');
    html = html.replace(/<p><\/p>/g, '');

    // Clean up excessive whitespace
    html = html.replace(/\n{3,}/g, '\n\n');

    return html;
}

/**
 * Extract plain text from HTML/markdown for previews
 */
export function extractPlainText(text: string | null | undefined, maxLength: number = 200): string {
    if (!text) return 'No description available';

    let plainText = text;

    // Remove HTML tags
    plainText = plainText.replace(/<[^>]*>/g, '');

    // Remove markdown formatting
    plainText = plainText.replace(/\*\*([^*]+)\*\*/g, '$1');
    plainText = plainText.replace(/\*([^*]+)\*/g, '$1');
    plainText = plainText.replace(/#{1,6}\s+/g, '');
    plainText = plainText.replace(/[\*\-•]\s+/g, '');

    // Unescape
    plainText = plainText.replace(/\\-/g, '-');
    plainText = plainText.replace(/\\\*/g, '*');
    plainText = plainText.replace(/\\_/g, '_');

    // Clean up whitespace
    plainText = plainText.replace(/\s+/g, ' ').trim();

    // Truncate
    if (plainText.length > maxLength) {
        plainText = plainText.substring(0, maxLength).trim();
        // Don't cut off mid-word
        const lastSpace = plainText.lastIndexOf(' ');
        if (lastSpace > maxLength - 50) {
            plainText = plainText.substring(0, lastSpace);
        }
        plainText += '...';
    }

    return plainText;
}

/**
 * List of invalid company name patterns
 */
const INVALID_COMPANY_PATTERNS = [
    'nan', 'null', 'undefined', 'n/a', 'none', 'tbd',
    'unknown', 'pending', 'to be determined', 'not specified',
    'company information pending', 'company not available'
];

/**
 * Check if a company name is valid (should be displayed)
 * Returns true if the company name is valid and should be shown
 */
export function isValidCompanyName(company: string | null | undefined): boolean {
    if (!company) return false;

    const normalized = company.toLowerCase().trim();

    // Check against invalid patterns
    for (const pattern of INVALID_COMPANY_PATTERNS) {
        if (normalized === pattern || normalized.includes(pattern)) {
            return false;
        }
    }

    // Must have at least 2 characters and contain letters
    if (company.trim().length < 2 || !/[a-zA-Z]/.test(company)) {
        return false;
    }

    return true;
}

/**
 * Format company name - handle edge cases like NaN, Unknown, etc.
 */
export function formatCompanyName(company: string | null | undefined): string {
    if (!isValidCompanyName(company)) {
        return 'Company Not Available';
    }

    // Clean up whitespace
    return company!.trim();
}

/**
 * Try to extract company name from job description if company is unknown
 */
export function extractCompanyFromDescription(description: string): string | null {
    if (!description) return null;

    // Common patterns for company mentions at the start of descriptions
    const patterns = [
        // "Company Name is seeking..."
        /^([A-Z][A-Za-z0-9\s&.,]+?)\s+is\s+seeking/,
        // "At Company Name, we..."
        /^At\s+([A-Z][A-Za-z0-9\s&.,]+?),\s+/,
        // "Company Name - Job Title"
        /^([A-Z][A-Za-z0-9\s&.,]+?)\s+[-–—]\s+/,
        // "Join Company Name"
        /^Join\s+([A-Z][A-Za-z0-9\s&.,]+?)\s+/,
        // University patterns
        /(?:University|College|Institute)\s+(?:of\s+)?([A-Za-z\s]+)/i,
    ];

    for (const pattern of patterns) {
        const match = description.match(pattern);
        if (match && match[1]) {
            const company = match[1].trim();
            // Validate it looks like a company name (not too long, not generic)
            if (company.length > 2 && company.length < 100 &&
                !company.toLowerCase().includes('job') &&
                !company.toLowerCase().includes('position')) {
                return company;
            }
        }
    }

    return null;
}
