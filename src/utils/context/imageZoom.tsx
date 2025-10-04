"use client"
import { createContext, CSSProperties, ReactNode, useContext, useEffect, useState } from "react";

interface ImageZoomContextType {
	isZoomed: boolean;
	style: CSSProperties;
	toggleZoom: () => void;
};


const ImageZoomContext = createContext<ImageZoomContextType | undefined>(undefined);

const styles: { zoomed: CSSProperties; normal: CSSProperties } = {
	zoomed: {
		opacity: 0.3
	},
	normal: { 
		opacity: 1
	}
}

export function ImageZoomProvider({ children }: { children: ReactNode }) {

	const [isZoomed, setIsZoomed] = useState<boolean>(false);
	const [style, setStyle] = useState<CSSProperties>(styles.normal);
	const toggleZoom = () => setIsZoomed(v => !v);

	useEffect(() => {
		setStyle(isZoomed ? styles.zoomed : styles.normal);
	}, [isZoomed]);

	return (
		<ImageZoomContext.Provider value={{ isZoomed, style, toggleZoom }}>
			{children}
		</ImageZoomContext.Provider>
	);

};

export function useImageZoom() {
	
	const context = useContext(ImageZoomContext);
	if (context === undefined) throw new Error('useImageZoom must be used within an ImageZoomProvider');
	return (context); 

};
